package com.aryan.ziplink.controller;

import com.aryan.ziplink.dto.request.*;
import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.AuthResponse;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.ratelimit.annotation.RateLimit;
import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import com.aryan.ziplink.service.impl.AuthServiceImpl;
import com.aryan.ziplink.util.ResponseUtil;
import jakarta.servlet.FilterChain;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @RateLimit(type = RateLimitType.REGISTER)
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request){
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        true,
                        "User Registered Successfully",
                        HttpStatus.CREATED.value(),
                        response
                ));
    }

    @PostMapping("/login")
    @RateLimit(type = RateLimitType.LOGIN)
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request){
        var response=authService.login(request);
        return ResponseUtil.ok("Login successful", response);
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token){
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.of(true,
                "Email verified Successfully",
                HttpStatus.OK.value(),
                null));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(@Valid
                                                                     @RequestBody
                                                                     ResendVerificationRequest request){
        authService.resendVerificationEmail(request);
        return ResponseEntity.ok(ApiResponse.of(true,
                "Verification email sent successfully",
                HttpStatus.OK.value(),
                null));
    }

    @PostMapping("/refresh")
    @RateLimit(type = RateLimitType.REFRESH_TOKEN)
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Token refreshed Successfully",
                HttpStatus.OK.value(),
                authService.refreshToken(request)
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request){
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Logged out successfully",
                HttpStatus.OK.value(),
                null
        ));
    }

    @PostMapping("/forgot-password")
    @RateLimit(type = RateLimitType.FORGOT_PASSWORD)
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        authService.forgotPassword(request);
        return ResponseEntity.ok(
                ApiResponse.of(true,
                        "If an account with this email exists, a password reset link has been sent.",
                        HttpStatus.OK.value(),
                        null)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Password reset successfully",
                HttpStatus.OK.value(),
                null
        ));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request){
        authService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.of(true,
                "Password changed successfully",
                HttpStatus.OK.value(),
                null));
    }
}
