package com.aryan.ziplink.security;

public final class SecurityConstants {
    private SecurityConstants(){}
    public static final String TOKEN_PREFIX="Bearer ";
    public static final String HEADER="Authorization";
    public static final long ACCESS_TOKEN_EXPIRATION=1000*60*60*24;
}
