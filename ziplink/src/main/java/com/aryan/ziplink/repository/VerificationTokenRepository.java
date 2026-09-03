package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.entity.VerificationToken;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);
    @Modifying
    @Query(
            """
                    DELETE FROM VerificationToken vt
                    WHERE vt.expiresAt <:now
                    """)
    int deleteExpiredTokens(
            @Param("now") Instant now);

}
