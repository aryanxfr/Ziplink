package com.aryan.ziplink.security.cookie;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;
import java.util.Optional;

public class CookieUtils {

    private CookieUtils(){}

    public static Optional<String> getCookieValue(HttpServletRequest request,
                                                  String cookieName){
        Cookie[] cookies = request.getCookies();
        if(cookies==null){
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
