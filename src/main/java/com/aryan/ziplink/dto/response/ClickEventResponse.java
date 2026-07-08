package com.aryan.ziplink.dto.response;

import java.time.Instant;

public record ClickEventResponse(
        Instant clickedAt,
        String ipAddress,
        String userAgent,
        String referer
) {
}
