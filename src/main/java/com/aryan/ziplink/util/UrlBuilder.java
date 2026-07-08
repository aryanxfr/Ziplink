package com.aryan.ziplink.util;


import com.aryan.ziplink.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UrlBuilder {
    private final AppProperties appProperties;
    public String buildShortUrl(String shortCode){
        return appProperties.baseUrl() + "/" + shortCode;
    }
}
