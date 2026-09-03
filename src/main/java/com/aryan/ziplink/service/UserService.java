package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.ChangeEmailRequest;
import com.aryan.ziplink.dto.request.DeleteAccountRequest;
import com.aryan.ziplink.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUser();
    void requestEmailChange(ChangeEmailRequest request);
    void deleteAccount(DeleteAccountRequest request);
}
