package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.DeleteAccountRequest;
import com.aryan.ziplink.dto.request.UpdateProfileRequest;
import com.aryan.ziplink.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUser();
    UserResponse updateProfile(UpdateProfileRequest request);
    void deleteAccount(DeleteAccountRequest request);
}
