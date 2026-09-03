package com.aryan.ziplink.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.short-code")
public record ShortCodeProperties( int length,
                                   int maxRetryAttempts,
                                   int defaultExpiryDays) {
}
