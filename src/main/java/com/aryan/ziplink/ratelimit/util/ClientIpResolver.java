package com.aryan.ziplink.ratelimit.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class ClientIpResolver {
    public String resolve(HttpServletRequest request){
        String forwarded=request.getHeader("X-forwarded-For");

        if(forwarded!=null && !forwarded.isBlank()){
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
