package com.aryan.ziplink.ratelimit.config;

public record RateLimitConfig(
        int requests,
        long duration

) {
}