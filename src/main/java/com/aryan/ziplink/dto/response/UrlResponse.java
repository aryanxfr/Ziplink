package com.aryan.ziplink.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UrlResponse (
        UUID id,
        String originalUrl,
        String shortCode,
        String shortUrl,
        Long clickCount,
        Instant expiresAt,
        Boolean active
){
}
