package com.aryan.ziplink.dto.response;

import com.aryan.ziplink.enums.Role;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        Role role,
        Boolean enabled,
        Instant createdAt
) {
}
