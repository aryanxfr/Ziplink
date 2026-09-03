package com.aryan.ziplink.controller;

import com.aryan.ziplink.ratelimit.annotation.RateLimit;
import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import com.aryan.ziplink.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class RedirectController {
    private final RedirectService redirectService;

    public RedirectController(RedirectService redirectService) {
        this.redirectService = redirectService;
    }

    @GetMapping("/{shortCode}")
    @RateLimit(type = RateLimitType.REDIRECT)
    public ResponseEntity<Void> Redirect(@PathVariable String shortCode, HttpServletRequest request){
        var originalUrl=redirectService.resolveOriginalUrl(shortCode,request);
        return ResponseEntity.status(HttpStatus.TEMPORARY_REDIRECT)
                .location(URI.create(originalUrl))
                .build();
    }
}
