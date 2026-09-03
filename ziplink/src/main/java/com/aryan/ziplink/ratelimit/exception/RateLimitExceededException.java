package com.aryan.ziplink.ratelimit.exception;

public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message){
        super(message);
    }
}
