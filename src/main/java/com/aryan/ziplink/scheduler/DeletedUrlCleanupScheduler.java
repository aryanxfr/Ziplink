package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.config.SchedulerProperties;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.repository.UrlRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Component
public class DeletedUrlCleanupScheduler {
    private final UrlRepository urlRepository;
    private final SchedulerProperties schedulerProperties;
    public DeletedUrlCleanupScheduler(UrlRepository urlRepository,SchedulerProperties schedulerProperties) {
        this.urlRepository = urlRepository;
        this.schedulerProperties=schedulerProperties;
    }

    @Scheduled(cron = "${scheduler.deleted-url-cleanup-cron}")
    @Transactional
    public void cleanUpDeletedUrls(){
        Instant cutoff=Instant.now()
                .minus(Duration.ofDays(schedulerProperties.deletedUrlRetentionDays()));
        List<Url> urls=urlRepository.findAllByDeletedAtIsNotNullAndDeletedAtBefore(cutoff);
        if (urls.isEmpty()){
            return;
        }

        urlRepository.deleteAll(urls);

        log.info("{} deleted URLs permanently removed", urls.size());
    }
}
