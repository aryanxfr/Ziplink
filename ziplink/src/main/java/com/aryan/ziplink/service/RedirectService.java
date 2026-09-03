package com.aryan.ziplink.service;

import jakarta.servlet.http.HttpServletRequest;

public interface RedirectService {
    String resolveOriginalUrl(String shortcode, HttpServletRequest request);

}
