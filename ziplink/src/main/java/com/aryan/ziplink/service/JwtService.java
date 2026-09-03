package com.aryan.ziplink.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.Map;

public interface JwtService {

    /* * Generates an access token for the given user.*/
    String generateToken(UserDetails userDetails);

    /*
     * Generates an access token with additional claims.
     */

    String generateToken(
            Map<String,Object> claims,
            UserDetails userDetails
    );
    /*
     * Extracts the username (email) from the JWT.
     */
    String extractUsername(String token);

    /*
     * Validates the token against the given user.
     */
    boolean isTokenValid(
            String token,
            UserDetails userDetails
    );
    /*
     * Extracts the expiration date from the JWT.
     */
    Date extractExpiration(String token);

    /**
     * Returns the configured token expiration time in milliseconds.
     */
    long getExpiration();
}
