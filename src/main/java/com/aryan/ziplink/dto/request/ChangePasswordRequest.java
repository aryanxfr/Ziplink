package com.aryan.ziplink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required")
        String currentPassword,

        @NotBlank(message ="New password is required")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
                message = "Password must contain uppercase, lowercase, number and special character."
        )
        String newPassword
) {
}
