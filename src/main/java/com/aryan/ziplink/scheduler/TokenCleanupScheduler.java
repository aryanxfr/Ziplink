package com.aryan.ziplink.scheduler;

import com.aryan.ziplink.entity.PasswordResetToken;
import com.aryan.ziplink.entity.RefreshToken;
import com.aryan.ziplink.entity.VerificationToken;
import com.aryan.ziplink.repository.PasswordResetTokenRepository;
import com.aryan.ziplink.repository.RefreshTokenRepository;
import com.aryan.ziplink.repository.VerificationTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
public class TokenCleanupScheduler {
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    public TokenCleanupScheduler(RefreshTokenRepository refreshTokenRepository, VerificationTokenRepository verificationTokenRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Scheduled(cron = "${scheduler.token-cleanup-cron}")
    @Transactional
    public void cleanupTokens(){
        Instant now=Instant.now();

        int refreshDeleted=refreshTokenRepository.deleteExpiredTokens(now);

        int verificationDeleted=verificationTokenRepository.deleteExpiredTokens(now);

        int resetDeleted=passwordResetTokenRepository.deleteExpiredOrUsedTokens(now);


        log.info(
                """
                        Token cleanup completed,
                        Refresh Tokens Deleted : {}
                        Verification Tokens Deleted : {}
                        Password Reset Tokens Deleted : {}
                        """,
                refreshDeleted,
                verificationDeleted,
                resetDeleted
        );
    }
}

