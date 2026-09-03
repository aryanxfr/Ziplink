package com.aryan.ziplink.dto.response;

import java.time.Instant;
import java.util.List;

public record UrlAnalyticsResponse (
        java.util.UUID urlId,
        String originalUrl,
        String shortCode,

        String shortUrl,

        Long clickCount,

        Boolean active,

        Instant expiresAt,

        List<ClickEventResponse> recentClicks,
        long uniqueVisitors

) {
}