package com.aryan.ziplink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ResetPasswordRequest(
        @NotBlank
        String token,

        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
                message = "Password must contain uppercase, lowercase, number and special character."
        )
        String newPassword
){
}
