package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.exception.UrlExpiredException;
import com.aryan.ziplink.exception.UrlInactiveException;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class RedirectServiceImpl implements RedirectService {
    private  final UrlRepository urlRepository;
    private final AnalyticsService analyticsService;
    public RedirectServiceImpl(UrlRepository urlRepository, AnalyticsService analyticsService){
        this.urlRepository=urlRepository;
        this.analyticsService = analyticsService;
    }

    @Cacheable(
            value = "redirects",
            key = "#shortCode"
    )
    public Url getCachedUrl(String shortCode){
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(()-> new ResourceNotFoundException("Short URL not found"));
    }

    @Override
    @Transactional
    public String resolveOriginalUrl(String shortCode,
                                     HttpServletRequest request) {
         Url url=getCachedUrl(shortCode);
         validate(url);
         url.setClickCount(url.getClickCount()+1);
         analyticsService.recordClick(url, request);
         return url.getOriginalUrl();
    }

    private void validate(Url url){
        if (url.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Short URL not found.");
        }
        if(!url.getActive()){
            throw new UrlInactiveException("This short url has been deactivated");
        }
        if(url.getExpiresAt()!=null &&
            url.getExpiresAt().isBefore(Instant.now())){
            url.setActive(false);
            throw new UrlExpiredException("This short url has been expired");
        }
    }
}
