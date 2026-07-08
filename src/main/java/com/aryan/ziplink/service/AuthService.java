package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.*;
import com.aryan.ziplink.dto.response.AuthResponse;
import com.aryan.ziplink.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void verifyEmail(String token);
    void resendVerificationEmail(ResendVerificationRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(RefreshTokenRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(ChangePasswordRequest request);


}