package com.aryan.ziplink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;

import java.time.Duration;

@Configuration
public class RedisConfig {
    private CacheProperties cacheProperties;
    public RedisConfig(CacheProperties cacheProperties) {
        this.cacheProperties = cacheProperties;
    }


    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(){
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(cacheProperties.redirectTtlHours()))
                .disableCachingNullValues();
    }

}
