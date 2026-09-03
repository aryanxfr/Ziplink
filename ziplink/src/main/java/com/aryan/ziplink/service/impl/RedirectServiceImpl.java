package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.cache.RedirectCacheEntry;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.exception.UrlExpiredException;
import com.aryan.ziplink.exception.UrlInactiveException;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class RedirectServiceImpl implements RedirectService {
    private final RedirectCacheService redirectCacheService;
    private final AnalyticsService analyticsService;
    private final UrlRepository urlRepository;
    private final CacheManager cacheManager;
    public RedirectServiceImpl(UrlRepository urlRepository, RedirectCacheService redirectCacheService, AnalyticsService analyticsService, CacheManager cacheManager){
        this.urlRepository = urlRepository;
        this.redirectCacheService = redirectCacheService;
        this.analyticsService = analyticsService;
        this.cacheManager = cacheManager;
    }

    @Override
    @Transactional
    public String resolveOriginalUrl(String shortCode,
                                     HttpServletRequest request) {
         RedirectCacheEntry url=redirectCacheService.getCachedUrl(shortCode);
         validate(shortCode, url);
         urlRepository.incrementClickCount(url.id());
         analyticsService.recordClick(url.id(), request);
         return url.originalUrl();
    }

    private void validate(String shortCode, RedirectCacheEntry url){
        if (url.deletedAt() != null) {
            throw new ResourceNotFoundException("Short URL not found.");
        }
        if(Boolean.FALSE.equals(url.active())){
            throw new UrlInactiveException("This short url has been deactivated");
        }
        if(url.expiresAt()!=null &&
            url.expiresAt().isBefore(Instant.now())){
            urlRepository.deactivateIfExpired(url.id(), Instant.now());
            var cache = cacheManager.getCache("redirects");
            if (cache != null) {
                cache.evict(shortCode);
            }
            throw new UrlExpiredException("This short url has been expired");
        }
    }
}
