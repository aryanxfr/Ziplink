package com.aryan.ziplink.dto.request;

import com.aryan.ziplink.enums.ExpiryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.Instant;
public record CreateUrlRequest (
        @NotBlank
        @Pattern(regexp="https?://.*",message = "Invalid URL")
        String originalUrl,
        String customAlias,
        ExpiryType expiryType,
        Instant expiresAt
){
}
