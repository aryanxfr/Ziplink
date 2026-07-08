package com.aryan.ziplink.exception;

public class UrlExpiredException extends RuntimeException{
    public UrlExpiredException(String message){
        super(message);
    }
}
