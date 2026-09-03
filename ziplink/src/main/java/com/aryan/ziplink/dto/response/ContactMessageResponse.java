package com.aryan.ziplink.dto.response;

import com.aryan.ziplink.enums.MessageStatus;

import java.time.Instant;
import java.util.UUID;

public record ContactMessageResponse(
        UUID id,
        String name,
        String email,
        String message,
        MessageStatus status,
        Instant createdAt
) {
}
