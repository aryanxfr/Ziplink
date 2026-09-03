package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.ClickEvent;
import com.aryan.ziplink.entity.Url;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ClickEventRepository extends JpaRepository<ClickEvent, UUID> {
    List<ClickEvent> findByUrlId(UUID urlId);
    List<ClickEvent> findTop10ByUrlOrderByClickedAtDesc(Url url);
    Page<ClickEvent> findByUrlOrderByClickedAtDesc(Url url, Pageable pageable);
    Page<ClickEvent> findByUrlAndClickedAtBetweenOrderByClickedAtDesc(Url url, Instant from, Instant to, Pageable pageable);
    @Query(
            "SELECT COUNT(DISTINCT c.ipAddress) FROM ClickEvent c WHERE c.url = :url AND c.ipAddress IS NOT NULL"
    )
    long countDistinctVisitorsByUrl(@org.springframework.data.repository.query.Param("url") Url url);
}
