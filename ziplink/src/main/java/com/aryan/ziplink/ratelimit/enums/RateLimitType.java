package com.aryan.ziplink.ratelimit.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RateLimitType {
    LOGIN("login"),
    REGISTER("register"),
    FORGOT_PASSWORD("forgot-password"),
    REFRESH_TOKEN("refresh-token"),
    REDIRECT("redirect"),
    CREATE_URL("create-url");
    private final String propertyKey;
}
