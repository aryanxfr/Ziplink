package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.request.DeleteAccountRequest;
import com.aryan.ziplink.dto.request.UpdateProfileRequest;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.mapper.UserMapper;
import com.aryan.ziplink.repository.RefreshTokenRepository;
import com.aryan.ziplink.repository.UserRepository;
import com.aryan.ziplink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public UserResponse getCurrentUser() {
        String email= SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User user=userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateProfile(UpdateProfileRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setUsername(request.username());
        User updatedUser=userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteAccount(DeleteAccountRequest request) {
        String email=SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User user=userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        if(!passwordEncoder.matches(request.password(), user.getPassword())){
            throw new BadCredentialsException("Incorrect Password");
        }

        user.setDeleted(true);
        user.setDeletedAt(Instant.now());

        refreshTokenRepository.deleteByUser(user);
        userRepository.save(user);
    }
}
