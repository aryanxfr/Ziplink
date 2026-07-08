package com.aryan.ziplink.ratelimit.interceptor;


import com.aryan.ziplink.ratelimit.annotation.RateLimit;
import com.aryan.ziplink.ratelimit.service.RateLimiterService;
import com.aryan.ziplink.ratelimit.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {
    private final RateLimiterService rateLimiterService;
    private final ClientIpResolver clientIpResolver;
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler){
        if(!(handler instanceof HandlerMethod handlerMethod)){
            return true;
        }

        RateLimit rateLimit=handlerMethod.getMethod().getAnnotation(RateLimit.class);

        if(rateLimit==null){
            return true;
        }

        String clientIp= clientIpResolver.resolve(request);

        rateLimiterService.validateRequest(
                clientIp,rateLimit.type()
        );
        return true;
    }
}
