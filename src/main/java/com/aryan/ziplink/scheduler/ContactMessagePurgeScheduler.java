package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.enums.MessageStatus;
import com.aryan.ziplink.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContactMessagePurgeScheduler {

    private final ContactMessageRepository contactMessageRepository;

    /**
     * Runs daily at 3:00 AM. Permanently deletes archived messages
     * that were soft-deleted more than 30 days ago.
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void purgeOldArchivedMessages() {
        Instant cutoff = Instant.now().minus(30, ChronoUnit.DAYS);
        int deleted = contactMessageRepository.purgeArchivedBefore(MessageStatus.ARCHIVED, cutoff);
        if (deleted > 0) {
            log.info("Purged {} archived contact messages older than 30 days", deleted);
        }
    }
}
