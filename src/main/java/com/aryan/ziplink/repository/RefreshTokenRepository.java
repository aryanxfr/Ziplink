package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.RefreshToken;
import com.aryan.ziplink.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findAllByUserAndRevokedFalse(User user);

    @Modifying
    @Query("""
            DELETE FROM RefreshToken rt
            WHERE rt.expiresAt < :now
            """)
    int deleteExpiredTokens(@Param("now") Instant now);
}



