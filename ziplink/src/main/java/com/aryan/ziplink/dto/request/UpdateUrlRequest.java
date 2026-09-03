package com.aryan.ziplink.dto.request;

import java.time.Instant;

public record UpdateUrlRequest (
        Instant expiresAt,
        Boolean active
){
}
