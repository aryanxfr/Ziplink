package com.aryan.ziplink.dto.cache;

import java.time.Instant;
import java.util.UUID;

public record RedirectCacheEntry(
        UUID id,
        String originalUrl,
        Boolean active,
        Instant expiresAt,
        Instant deletedAt
) {
}
