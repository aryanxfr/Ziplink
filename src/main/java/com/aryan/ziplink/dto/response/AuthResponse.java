package com.aryan.ziplink.dto.response;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        String refreshToken
) {
}
