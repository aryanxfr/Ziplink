package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.PasswordResetToken;
import com.aryan.ziplink.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findFirstByUserOrderByExpiresAtDesc(User user);
    @Modifying
    @Query("""
            DELETE FROM PasswordResetToken prt
            WHERE prt.usedAt IS NOT NULL
            OR prt.expiresAt < :now
            """)
    int deleteExpiredOrUsedTokens(
            @Param("now") Instant now
    );

}
