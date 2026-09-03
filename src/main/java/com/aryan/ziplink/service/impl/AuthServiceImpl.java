package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.config.JwtProperties;
import com.aryan.ziplink.dto.request.*;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.entity.PasswordResetToken;
import com.aryan.ziplink.entity.RefreshToken;
import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.entity.VerificationToken;
import com.aryan.ziplink.enums.Role;
import com.aryan.ziplink.exception.BadRequestException;
import com.aryan.ziplink.exception.DuplicateResourceException;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.exception.UnauthorizedException;
import com.aryan.ziplink.mapper.UserMapper;
import com.aryan.ziplink.repository.PasswordResetTokenRepository;
import com.aryan.ziplink.repository.RefreshTokenRepository;
import com.aryan.ziplink.repository.UserRepository;
import com.aryan.ziplink.repository.VerificationTokenRepository;
import com.aryan.ziplink.security.CustomUserDetails;
import com.aryan.ziplink.security.auth.AuthenticatedSession;
import com.aryan.ziplink.service.AuthService;
import com.aryan.ziplink.service.JwtService;
import com.aryan.ziplink.service.MailService;
import com.aryan.ziplink.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MailService mailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    public AuthServiceImpl(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            MailService mailService, VerificationTokenRepository verificationTokenRepository, RefreshTokenRepository refreshTokenRepository, JwtProperties jwtProperties, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.verificationTokenRepository = verificationTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProperties = jwtProperties;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public UserResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new DuplicateResourceException(
                    "Email already exists"
            );
        }
        if(userRepository.existsByUsername(request.username())){
            throw new DuplicateResourceException(
                    "Username already exists"
            );
        }
        var user=userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        User savedUser=userRepository.save(user);

        VerificationToken token= VerificationToken.builder()
                        .token(UUID.randomUUID().toString())
                                .user(savedUser)
                                        .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                                                .build();
        verificationTokenRepository.save(token);

        mailService.sendVerificationEmail(savedUser,frontendUrl + "/verification-success?token=" + token.getToken());
        return userMapper.toResponse(savedUser);
    }

    @Override
    public AuthenticatedSession login(LoginRequest request){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                ));

        CustomUserDetails userDetails=
                (CustomUserDetails) authentication.getPrincipal();

        User user=userDetails.getUser();

        String accessToken = jwtService.generateToken(userDetails);

        String refreshToken=UUID.randomUUID().toString();

        RefreshToken refreshTokenEntity=RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiresAt(Instant.now().plusMillis(jwtProperties.refreshExpiration()))
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
        return new AuthenticatedSession(
                accessToken,
                refreshToken

        );
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken=verificationTokenRepository
                .findByToken(token)
                .orElseThrow(()-> new ResourceNotFoundException("Invalid verification token"));
        if(verificationToken.getVerifiedAt()!=null){
            throw new BadRequestException("Email is already verified");
        }
        if (verificationToken.getExpiresAt().isBefore(Instant.now())){
            throw new BadRequestException("Verification token has expired");
        }
        User user=verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        mailService.sendWelcomeEmail(user);
        verificationToken.setVerifiedAt(Instant.now());
        verificationTokenRepository.save(verificationToken);
    }

    @Override
    @Transactional
    public void resendVerificationEmail(ResendVerificationRequest request) {
        User user=userRepository.findByEmail(request.email())
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        if (user.getEnabled()) {
            throw new BadRequestException("Email is already verified.");
        }
        verificationTokenRepository
                .findByUser(user)
                .ifPresent(verificationTokenRepository::delete);

        VerificationToken verificationToken= VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plus(1,ChronoUnit.DAYS))
                .build();

        verificationTokenRepository.save(verificationToken);

        mailService.sendVerificationEmail(user,
                frontendUrl + "/verification-success?token="+ verificationToken.getToken());
    }

    @Override
    @Transactional
    public AuthenticatedSession refreshToken(String refreshToken) {
        RefreshToken storedToken=refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(()-> new UnauthorizedException("Invalid Refresh Token"));
        if(storedToken.getExpiresAt().isBefore(Instant.now())){
            refreshTokenRepository.delete(storedToken);
            throw new UnauthorizedException("Refresh Token expired");
        }
        User user=storedToken.getUser();

        UserDetails userDetails=new CustomUserDetails(user);
        String newAccessToken= jwtService.generateToken(userDetails);

        refreshTokenRepository.delete(storedToken);

        String newRefreshToken=UUID.randomUUID().toString();
        RefreshToken refreshTokenEntity=RefreshToken.builder()
                .token(newRefreshToken)
                .user(user)
                .expiresAt(Instant.now().plusMillis(jwtProperties.refreshExpiration())
                )
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        return new AuthenticatedSession(
                newAccessToken,
                newRefreshToken
        );
    }

    @Override
    public void logout(String refreshToken) {
        RefreshToken storedToken=refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(()-> new UnauthorizedException("Invalid refresh token"));

        refreshTokenRepository.delete(storedToken);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> optionalUser=userRepository.findByEmail(request.email());
        if (optionalUser.isEmpty()){
            return;
        }

        User user=optionalUser.get();

        Optional<PasswordResetToken> existingToken =
                passwordResetTokenRepository
                        .findFirstByUserOrderByExpiresAtDesc(user);
        PasswordResetToken resetToken;

        if (existingToken.isPresent()
                && existingToken.get().getUsedAt() == null
                && existingToken.get().getExpiresAt().isAfter(Instant.now())) {

            resetToken = existingToken.get();
        }else {
            resetToken = PasswordResetToken.builder()
                    .token(UUID.randomUUID().toString())
                    .user(user)
                    .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                    .build();

            passwordResetTokenRepository.save(resetToken);
        }
        mailService.sendPasswordResetEmail( user,
                 frontendUrl + "/reset-password?token="+ resetToken.getToken());
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token=passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(()-> new BadRequestException("Invalid password reset token"));

        if (token.getUsedAt()!=null){
            throw new BadRequestException("Password reset token has already expired");
        }

        if (token.getExpiresAt().isBefore(Instant.now())){
            throw new BadRequestException("Password reset token has expired");
        }

        User user=token.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        token.setUsedAt(Instant.now());
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User currentUser= SecurityUtils.currentUser();

        if(!passwordEncoder.matches(request.currentPassword(),currentUser.getPassword())){
            throw new BadRequestException("Current password is incorrect");
        }

        if(passwordEncoder.matches(request.newPassword(),currentUser.getPassword())){
            throw new BadRequestException("New password must be different from current password");
        }

        currentUser.setPassword(passwordEncoder.encode(request.newPassword()));

        List<RefreshToken> refreshTokens=refreshTokenRepository.findAllByUserAndRevokedFalse(currentUser);
        for(RefreshToken refreshToken:refreshTokens){
            refreshToken.setRevoked(true);
        }

        refreshTokenRepository.saveAll(refreshTokens);
        userRepository.save(currentUser);

    }
    @Override
    @Transactional
    public void verifyEmailChange(String token) {
        VerificationToken verificationToken = verificationTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Verification token has expired. Please request a new email change.");
        }

        User user = verificationToken.getUser();

        if (user.getPendingEmail() == null || user.getPendingEmail().isBlank()) {
            throw new BadRequestException("No pending email change found.");
        }

        // Check the pending email is still available
        if (userRepository.existsByEmail(user.getPendingEmail())) {
            throw new BadRequestException("This email is already in use by another account.");
        }

        // Swap the email
        user.setEmail(user.getPendingEmail());
        user.setPendingEmail(null);
        userRepository.save(user);

        // Delete the verification token
        verificationTokenRepository.delete(verificationToken);

        // Invalidate all refresh tokens (force re-login with new email)
        refreshTokenRepository.deleteByUser(user);
    }
}
