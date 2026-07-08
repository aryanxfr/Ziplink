package com.aryan.ziplink.ratelimit.config;

import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rate-limit")
public record RateLimitProperties(
        RateLimitConfig login,
        RateLimitConfig register,
        RateLimitConfig forgotPassword,
        RateLimitConfig refreshToken,
        RateLimitConfig redirect,
        RateLimitConfig createUrl
) {
    public RateLimitConfig getConfig(RateLimitType type) {
        return switch (type) {
            case LOGIN -> login;
            case REGISTER -> register;
            case FORGOT_PASSWORD -> forgotPassword;
            case REFRESH_TOKEN -> refreshToken;
            case REDIRECT -> redirect;
            case CREATE_URL -> createUrl;
        };
    }

}
