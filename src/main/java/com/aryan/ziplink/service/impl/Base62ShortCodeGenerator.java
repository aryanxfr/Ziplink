package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.config.ShortCodeProperties;
import com.aryan.ziplink.service.ShortCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class Base62ShortCodeGenerator implements ShortCodeGenerator {
    private final ShortCodeProperties properties;
    private static final String  BASE62="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private final SecureRandom secureRandom=new SecureRandom();

    public Base62ShortCodeGenerator(ShortCodeProperties properties){
        this.properties=properties;
    }
    @Override
    public String generateShortCode() {
        StringBuilder builder=new StringBuilder();
        for(int attempt=1;attempt<=properties.length();attempt++){
            builder.append(BASE62.charAt(secureRandom.nextInt(BASE62.length())));
        }
        return builder.toString();
    }
}
