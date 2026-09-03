package com.aryan.ziplink.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ClickEventResponse(
        UUID id,
        Instant clickedAt,
        String ipAddress,
        String userAgent,
        String referer
) {
}
