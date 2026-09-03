package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@Slf4j
public class DeletedAccountCleanupScheduler {
    private final UserRepository userRepository;

    public DeletedAccountCleanupScheduler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "${app.scheduler}")
    @Transactional
    public void cleanupDeletedAccounts(){
        Instant cutoff=Instant.now().minus(15, ChronoUnit.DAYS);

        List<User> users= userRepository.findAllByDeletedTrueAndDeletedAtBefore(cutoff);

        if(users.isEmpty()){
            return;
        }

        log.info("Deleting {} expired accounts", users.size());

        userRepository.deleteAll(users);

        log.info("Deleted {} expired accounts successfully", users.size());
    }
}
