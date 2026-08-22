package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.cache.RedirectCacheEntry;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedirectCacheService {
    private final UrlRepository urlRepository;

    @Cacheable(
            value = "redirects",
            key = "#shortCode"
    )
    public RedirectCacheEntry getCachedUrl(String shortCode){
        return urlRepository.findRedirectCacheEntryByShortCode(shortCode)
                .orElseThrow(()-> new ResourceNotFoundException("Short URL not found"));
    }

}
