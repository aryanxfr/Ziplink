package com.aryan.ziplink.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "scheduler")
public record SchedulerProperties(
        String urlExpiryCron,
        String deletedUrlCleanupCron,
        int deletedUrlRetentionDays,
        String tokenCleanupCron,
        String expiryReminderCron,
        int expiryReminderHours

){
}
