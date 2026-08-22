package com.aryan.ziplink.security.auth;

import com.aryan.ziplink.dto.response.AuthResponse;
import com.aryan.ziplink.entity.User;

public record AuthenticatedSession(
        String accessToken,
        String refreshToken
        ) {
}
