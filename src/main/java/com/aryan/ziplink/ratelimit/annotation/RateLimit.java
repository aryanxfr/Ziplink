package com.aryan.ziplink.ratelimit.annotation;

import com.aryan.ziplink.ratelimit.enums.RateLimitType;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {
    RateLimitType type();
}
