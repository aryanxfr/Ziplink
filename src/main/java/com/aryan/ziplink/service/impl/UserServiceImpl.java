package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.request.ChangeEmailRequest;
import com.aryan.ziplink.dto.request.DeleteAccountRequest;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.entity.VerificationToken;
import com.aryan.ziplink.exception.BadRequestException;
import com.aryan.ziplink.exception.DuplicateResourceException;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.mapper.UserMapper;
import com.aryan.ziplink.repository.RefreshTokenRepository;
import com.aryan.ziplink.repository.UserRepository;
import com.aryan.ziplink.repository.VerificationTokenRepository;
import com.aryan.ziplink.service.MailService;
import com.aryan.ziplink.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, RefreshTokenRepository refreshTokenRepository, VerificationTokenRepository verificationTokenRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.mailService = mailService;
    }

    @Override
    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }

    @Override
    public void requestEmailChange(ChangeEmailRequest request) {
        String currentEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmailAndDeletedFalse(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Incorrect password");
        }

        String newEmail = request.newEmail().trim().toLowerCase();

        // Check same email
        if (newEmail.equals(user.getEmail())) {
            throw new BadRequestException("New email is the same as current email.");
        }

        // Check email not taken
        if (userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("This email is already in use.");
        }

        // Store pending email
        user.setPendingEmail(newEmail);
        userRepository.save(user);

        // Delete any existing verification token for this user
        verificationTokenRepository.findByUser(user)
                .ifPresent(verificationTokenRepository::delete);

        // Create new verification token
        VerificationToken token = VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .build();
        verificationTokenRepository.save(token);

        // Send verification email to the NEW email address
        String verificationLink = frontendUrl + "/verify-email-change?token=" + token.getToken();
        mailService.sendEmailChangeVerification(user, newEmail, verificationLink);
    }

    @Override
    public void deleteAccount(DeleteAccountRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Incorrect Password");
        }

        user.setDeleted(true);
        user.setDeletedAt(Instant.now());

        refreshTokenRepository.deleteByUser(user);
        userRepository.save(user);
    }
}
