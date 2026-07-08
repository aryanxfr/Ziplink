package com.aryan.ziplink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "urls")
public class Url extends BaseEntity{
    @Id
    @UuidGenerator
    @Column(nullable = false,updatable = false)
    private UUID id;

    @Column(name = "original_url",nullable = false)
    private String originalUrl;

    @Column(name = "custom_alias",length = 50,unique = true)
    private String customAlias;

    @Column(name = "short_code", nullable = false, unique = true, length = 20)
    private String shortCode;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Builder.Default
    @Column(name = "click_count")
    private Long clickCount=0L;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active=true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "url",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<ClickEvent> clickEvents=new ArrayList<>();

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "reminder_sent_at")
    private Instant reminderSentAt;


}
