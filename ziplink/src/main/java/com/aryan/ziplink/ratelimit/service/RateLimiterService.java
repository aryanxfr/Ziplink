package com.aryan.ziplink.ratelimit.service;

import com.aryan.ziplink.ratelimit.enums.RateLimitType;

public interface RateLimiterService {
    void validateRequest(String identifier,
                         RateLimitType type);
}
