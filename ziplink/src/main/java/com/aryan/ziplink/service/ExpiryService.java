package com.aryan.ziplink.service;

import com.aryan.ziplink.enums.ExpiryType;

import java.time.Instant;

public interface ExpiryService {
    Instant resolveExpiry(ExpiryType expiryType,
                          Instant customExpiry);
}
