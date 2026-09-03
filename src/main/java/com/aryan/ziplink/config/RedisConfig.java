package com.aryan.ziplink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;

import java.time.Duration;

@Configuration
public class RedisConfig {
    private final CacheProperties cacheProperties;
    public RedisConfig(CacheProperties cacheProperties) {
        this.cacheProperties = cacheProperties;
    }


    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(){
        var cacheTypeValidator = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.aryan.ziplink.dto.cache.")
                .build();

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(cacheProperties.redirectTtlHours()))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(GenericJacksonJsonRedisSerializer.create(builder ->
                                builder.enableDefaultTyping(cacheTypeValidator))))
                .disableCachingNullValues();
    }

}
