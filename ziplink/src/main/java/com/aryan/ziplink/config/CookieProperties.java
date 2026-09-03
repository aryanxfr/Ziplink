package com.aryan.ziplink.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cookie")
public record CookieProperties(
        boolean secure,
        String sameSite,
        AccessTokenProperties accessToken,
        RefreshTokenProperties refreshToken

) {
    public record AccessTokenProperties(
            String name,
            String path
    ){}

    public record RefreshTokenProperties(
            String name,
            String path
    ){}
}
