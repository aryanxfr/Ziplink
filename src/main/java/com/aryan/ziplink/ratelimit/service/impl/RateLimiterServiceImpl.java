package com.aryan.ziplink.ratelimit.service.impl;

import com.aryan.ziplink.ratelimit.config.RateLimitConfig;
import com.aryan.ziplink.ratelimit.config.RateLimitProperties;
import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import com.aryan.ziplink.ratelimit.exception.RateLimitExceededException;
import com.aryan.ziplink.ratelimit.service.RateLimiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimiterServiceImpl implements RateLimiterService {

    private final StringRedisTemplate redisTemplate;
    private final RateLimitProperties rateLimitProperties;
    @Override
    public void validateRequest(String identifier, RateLimitType type) {
        RateLimitConfig config=rateLimitProperties.getConfig(type);

        String key=buildKey(identifier,type);
        Long count=redisTemplate.opsForValue().increment(key);

        if(count!=null && count==1){
            redisTemplate.expire(key,
                    Duration.ofSeconds(config.duration()));
        }

        if (count!=null && count > config.requests()){
            throw new RateLimitExceededException("Rate limit Exceeded");
        }
    }

    private String buildKey(String identifier, RateLimitType type){
        return "rate_limit:" + type.name() + ":" + identifier;
    }
}
