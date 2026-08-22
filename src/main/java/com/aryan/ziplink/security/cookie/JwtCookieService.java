package com.aryan.ziplink.security.cookie;

import org.springframework.http.ResponseCookie;

public interface JwtCookieService {
    ResponseCookie createAccessTokenCookie(String token);
    ResponseCookie createRefreshTokenCookie(String token);
    ResponseCookie clearAccessTokenCookie();
    ResponseCookie clearRefreshTokenCookie();

}
