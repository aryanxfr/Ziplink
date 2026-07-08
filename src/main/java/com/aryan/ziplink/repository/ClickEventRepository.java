package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.ClickEvent;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ClickEventRepository extends JpaRepository<ClickEvent, UUID> {
    List<ClickEvent> findTop10ByUrlOrderByClickedAtDesc(Url url);
    Page<ClickEvent> findByUrlOrderByClickedAtDesc(Url url, Pageable pageable);
    Page<ClickEvent> findByUrlAndClickedAtBetweenOrderByClickedAtDesc(Url url, Instant from, Instant to, Pageable pageable);
    List<ClickEvent> findByUrl(Url url);
}
