package com.aryan.ziplink.controller;


import com.aryan.ziplink.dto.request.DeleteAccountRequest;
import com.aryan.ziplink.dto.request.UpdateProfileRequest;
import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.security.cookie.JwtCookieService;
import com.aryan.ziplink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")

public class UserController {
    private final UserService userService;
    private final JwtCookieService jwtCookieService;

    public UserController(UserService userService, JwtCookieService jwtCookieService) {
        this.userService = userService;
        this.jwtCookieService = jwtCookieService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(){
        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Users fetched successfully",
                        HttpStatus.OK.value(),
                        userService.getCurrentUser()
                )
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Profile updated successfully",
                HttpStatus.OK.value(),
                userService.updateProfile(request)
        ));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @Valid @RequestBody DeleteAccountRequest request){
        userService.deleteAccount(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,jwtCookieService.clearAccessTokenCookie().toString())
                .header(HttpHeaders.SET_COOKIE, jwtCookieService.clearRefreshTokenCookie().toString())
                .body(ApiResponse.of(
                        true,
                        "Account scheduled for deletion. It will be permanently deleted after 15 days.",
                        HttpStatus.OK.value(),
                        null
                ));
    }
}
