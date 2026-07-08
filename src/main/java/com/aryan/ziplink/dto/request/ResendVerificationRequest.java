package com.aryan.ziplink.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResendVerificationRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid Email format")
        String email
) {
}
