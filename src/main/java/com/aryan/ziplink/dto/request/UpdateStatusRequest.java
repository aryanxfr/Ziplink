package com.aryan.ziplink.dto.request;

import com.aryan.ziplink.enums.MessageStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "Status is required")
        MessageStatus status
) {
}
