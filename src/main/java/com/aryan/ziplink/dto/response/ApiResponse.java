package com.aryan.ziplink.dto.response;

import java.time.Instant;

public record ApiResponse<T>(
        Instant timestamp,
        boolean success,
        String message,
        int status,
        T data
) {
    public static <T> ApiResponse<T> of(boolean success,String message, int status,T data){
        return new ApiResponse<>(Instant.now(),
                success,
                message,
                status,
                data);
    }
}
