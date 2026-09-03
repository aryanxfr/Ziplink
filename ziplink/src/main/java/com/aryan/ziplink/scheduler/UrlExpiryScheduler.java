package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.repository.UrlRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
public class UrlExpiryScheduler {
    private final UrlRepository urlRepository;
    private final CacheManager cacheManager;

    public UrlExpiryScheduler(UrlRepository urlRepository, CacheManager cacheManager) {
        this.urlRepository = urlRepository;
        this.cacheManager = cacheManager;
    }

    @Scheduled(cron="${scheduler.url-expiry-cron}")
    @Transactional
    public void expireUrl(){
        List<Url> expiredUrls=urlRepository.findAllByActiveTrueAndExpiresAtBefore(Instant.now());
        if (expiredUrls.isEmpty()){
            return;
        }

        for (Url url: expiredUrls){
            url.setActive(false);
            cacheManager.getCache("redirects")
                    .evict(url.getShortCode());
        }
        urlRepository.saveAll(expiredUrls);
        log.info("{} URLs expired automatically.",expiredUrls.size());
    }



}
