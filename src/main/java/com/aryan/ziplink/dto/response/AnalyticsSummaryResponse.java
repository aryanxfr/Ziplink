package com.aryan.ziplink.dto.response;

public record AnalyticsSummaryResponse(
        long totalUrls,

        long activeUrls,

        long inactiveUrls,

        long expiredUrls,

        long totalClicks
) {
}
