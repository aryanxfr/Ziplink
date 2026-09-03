package com.aryan.ziplink.util;

import com.aryan.ziplink.entity.User;
import com.aryan.ziplink.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {
    private SecurityUtils(){
    }
    public static User currentUser(){
        Authentication authentication= SecurityContextHolder.
                getContext().
                getAuthentication();
        if(authentication==null || !authentication.isAuthenticated()){
            throw new IllegalStateException("No authenticated user found");
        }
        var principal=authentication.getPrincipal();
        if(!(principal instanceof CustomUserDetails userDetails)){
            throw new IllegalStateException("Invalid authentication principal");
        }
        return userDetails.getUser();
    }
    public static UUID currentUserId(){
        return currentUser().getId();
    }

    public static String currentUsername(){
        return currentUser().getUsername();
    }
    public static String currentEmail() {
        return currentUser().getEmail();
    }
}
