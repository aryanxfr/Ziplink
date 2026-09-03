package com.aryan.ziplink.controller;

import com.aryan.ziplink.config.CookieProperties;
import com.aryan.ziplink.dto.request.*;
import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.AuthResponse;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.exception.UnauthorizedException;
import com.aryan.ziplink.ratelimit.annotation.RateLimit;
import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import com.aryan.ziplink.security.auth.AuthenticatedSession;
import com.aryan.ziplink.security.cookie.CookieUtils;
import com.aryan.ziplink.security.cookie.JwtCookieService;
import com.aryan.ziplink.service.JwtService;
import com.aryan.ziplink.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtCookieService jwtCookieService;
    private final JwtService jwtService;
    private final CookieProperties cookieProperties;
    public AuthController(AuthService authService, JwtCookieService jwtCookieService, JwtService jwtService, CookieProperties cookieProperties) {
        this.authService = authService;
        this.jwtCookieService = jwtCookieService;
        this.jwtService = jwtService;
        this.cookieProperties = cookieProperties;
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

        AuthenticatedSession session=authService.login(request);

        ResponseCookie accessCookie=jwtCookieService.createAccessTokenCookie(session.accessToken());

        ResponseCookie refreshCookie=jwtCookieService.createRefreshTokenCookie(session.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE,refreshCookie.toString())
                .body(
                        ApiResponse.of(
                                true,
                                "Login Successful",
                                HttpStatus.OK.value(),
                                new AuthResponse(
                                        "Bearer",
                                        jwtService.getExpiration()
                                )
                        )
                );
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
            HttpServletRequest request){
        String refreshToken= CookieUtils.getCookieValue(
                request,
                cookieProperties.refreshToken().name()
        ).orElseThrow(()-> new UnauthorizedException("Refresh token not found"));

        AuthenticatedSession session=authService.refreshToken(refreshToken);

        ResponseCookie accessCookie=jwtCookieService.createAccessTokenCookie(session.accessToken());

        ResponseCookie refreshCookie=jwtCookieService.createRefreshTokenCookie(session.refreshToken());


        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE,refreshCookie.toString())
                .body(
                        ApiResponse.of(
                                true,
                                "Token refreshed successfully",
                                HttpStatus.OK.value(),
                                new AuthResponse(
                                        "Bearer",
                                        jwtService.getExpiration()
                                )
                        )
                );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request){
        String refreshToken = CookieUtils.getCookieValue(
                request,
                cookieProperties.refreshToken().name()
        ).orElseThrow(() ->
                new UnauthorizedException("Refresh token not found")
        );

        authService.logout(refreshToken);

        ResponseCookie accessCookie = jwtCookieService.clearAccessTokenCookie();

        ResponseCookie refreshCookie = jwtCookieService.clearRefreshTokenCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(
                        ApiResponse.of(
                                true,
                                "Logged out successfully",
                                HttpStatus.OK.value(),
                                null
                        )
                );
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

    @GetMapping("/verify-email-change")
    public ResponseEntity<ApiResponse<Void>> verifyEmailChange(@RequestParam String token) {
        authService.verifyEmailChange(token);
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Email updated successfully. Please log in with your new email.",
                HttpStatus.OK.value(),
                null
        ));
    }
}
