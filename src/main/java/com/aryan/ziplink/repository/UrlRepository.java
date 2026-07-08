package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.ClickEvent;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UrlRepository extends JpaRepository<Url, UUID> , JpaSpecificationExecutor<Url> {
    Optional<Url> findByShortCode(String shortcode);
    boolean existsByShortCode(String shortcode);
    Optional<Url> findByCustomAlias(String CustomAlias);
    boolean existsByCustomAlias(String customAlias);
    Optional<Url> findByUserAndOriginalUrlAndActiveTrueAndExpiresAtAfter(User user, String originalUrl, Instant now);
    Optional<Url> findById(UUID urlId);
    Page<Url> findByUserOrderByClickCountDesc(User user, Pageable pageable);
    long countByUser(User user);
    long countByUserAndActiveTrue(User user);
    long countByUserAndActiveFalse(User user);
    List<Url> findByUser(User user);
    List<Url> findTop10ByUserOrderByCreatedAtDesc(User user);
    List<Url> findTop10ByUserOrderByClickCountDesc(User user);
    List<Url> findTop10ByUserAndExpiresAtAfterOrderByExpiresAtAsc(User user, Instant now);
    List<Url> findAllByActiveTrueAndExpiresAtBefore(Instant now);
    List<Url> findAllByDeletedAtIsNotNullAndDeletedAtBefore(Instant cutoff);

    @Query("""
            SELECT u
            FROM Url u
            WHERE u.active=true
            AND u.deletedAt is NULL
            AND u.expiresAt is NULL
            AND u.reminderSentAt is NULL
            AND u.expiresAt>  :now
            AND u.expiresAt <= :reminderThreshold
            """)
    List<Url> findUrlsExpiringBetween(@Param("now") Instant now,
                                      @Param("reminderThreshold") Instant reminderThreshold);


}
