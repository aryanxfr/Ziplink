package com.aryan.ziplink.security.cookie;

import com.aryan.ziplink.config.CookieProperties;
import com.aryan.ziplink.config.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class JwtCookieServiceImpl implements JwtCookieService{

    private final CookieProperties cookieProperties;
    private final JwtProperties jwtProperties;

    @Override
    public ResponseCookie createAccessTokenCookie(String token) {
        return buildCookie(
                cookieProperties.accessToken().name(),
                token,
                cookieProperties.accessToken().path(),
                accessTokenMaxAge()
        );
    }

    @Override
    public ResponseCookie createRefreshTokenCookie(String token) {
        return buildCookie(
                cookieProperties.refreshToken().name(),
                token,
                cookieProperties.refreshToken().path(),
                refreshTokenMaxAge()
        );
    }

    @Override
    public ResponseCookie clearAccessTokenCookie() {
        return buildCookie(
                cookieProperties.accessToken().name(),
                "",
                cookieProperties.accessToken().path(),
                Duration.ZERO
        );
    }

    @Override
    public ResponseCookie clearRefreshTokenCookie() {
        return buildCookie(
                cookieProperties.refreshToken().name(),
                "",
                cookieProperties.refreshToken().path(),
                Duration.ZERO
        );
    }

    private ResponseCookie buildCookie(
            String name,
            String value,
            String path,
            Duration maxAge
    ){
        return ResponseCookie.from(name,value)
                .httpOnly(true)
                .secure(cookieProperties.secure())
                .sameSite(cookieProperties.sameSite())
                .path(path)
                .maxAge(maxAge)
                .build();
    }

    private Duration accessTokenMaxAge(){
        return Duration.ofMillis(
                jwtProperties.expiration());
    }

    private Duration refreshTokenMaxAge(){
        return Duration
                .ofMillis(jwtProperties.refreshExpiration());
    }
}
