package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.config.SchedulerProperties;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExpiryReminderScheduler {
    private final UrlRepository urlRepository;
    private final MailService mailService;
    private final SchedulerProperties schedulerProperties;

    @Scheduled(cron = "${scheduler.expiry-reminder-cron}")
    @Transactional
    public void sendExpiryReminder(){
        Instant now=Instant.now();

        Instant reminderThreshold=now.plus(schedulerProperties.expiryReminderHours(), ChronoUnit.HOURS);
        List<Url> urls=urlRepository.findUrlsExpiringBetween(now,reminderThreshold);

        for (Url url:urls){
            try {
                mailService.sendExpiryReminderEmail(url.getUser(), url);
                url.setReminderSentAt(Instant.now());
            } catch(Exception ex){
                log.error("Failed to send expiry reminder for URL {}",
                        url.getId(), ex);
            }
        }

    }
}

