package com.aryan.ziplink.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cache")
public record CacheProperties(
        long redirectTtlHours
) {
}
