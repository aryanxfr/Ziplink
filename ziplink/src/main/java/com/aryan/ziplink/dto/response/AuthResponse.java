package com.aryan.ziplink.dto.response;

public record AuthResponse(
        String tokenType,
        long expiresIn
) {
}
