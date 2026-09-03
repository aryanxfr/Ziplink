package com.aryan.ziplink.util;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtils {
    public static String getClientIp(HttpServletRequest request){
        String forwarded=request.getHeader("X-Forwarded-For");
        if(forwarded!=null && !forwarded.isBlank()){
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
    private RequestUtils(){

    }
}
