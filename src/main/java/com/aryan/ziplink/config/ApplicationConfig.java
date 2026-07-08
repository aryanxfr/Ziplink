package com.aryan.ziplink.config;

import com.aryan.ziplink.ratelimit.config.RateLimitProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        JwtProperties.class,
        ShortCodeProperties.class,
        AppProperties.class,
        SchedulerProperties.class,
        RateLimitProperties.class,
        CacheProperties.class
})
public class ApplicationConfig {
}
