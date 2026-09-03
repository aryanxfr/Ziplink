package com.aryan.ziplink.util;

import com.aryan.ziplink.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseUtil {
    private ResponseUtil(){}
    public static <T>ResponseEntity<ApiResponse<T>> ok(
            String message,
            T data
    ){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                message,
                HttpStatus.OK.value(),
                data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(
            String message,
            T data){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        true,
                        message,
                        HttpStatus.CREATED.value(),
                        data));
    }
}
