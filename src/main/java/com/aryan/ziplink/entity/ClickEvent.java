package com.aryan.ziplink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "click_events",
    indexes = {
        @Index(name = "idx_click_event_url",
        columnList = "url_id")
    }
)
public class ClickEvent {
    @Id
    @UuidGenerator
    @Column(nullable = false,updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id",nullable = false)
    private Url url;

    @Column(name = "ip_address",length = 45)
    private String ipAddress;

    @Column(name = "user_agent",length = 512)
    private String userAgent;

    @Column(name = "referer",length = 512)
    private String referer;

    @Column(name = "clicked_at",nullable = false)
    private Instant clickedAt;
}
