package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.*;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.security.auth.AuthenticatedSession;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthenticatedSession login(LoginRequest request);
    void verifyEmail(String token);
    void resendVerificationEmail(ResendVerificationRequest request);
    AuthenticatedSession refreshToken(String refreshToken);
    void logout(String refreshToken);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(ChangePasswordRequest request);



}