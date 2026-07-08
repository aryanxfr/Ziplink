package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.request.CreateUrlRequest;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.enums.UrlFilterStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface UrlService {
    UrlResponse createShortUrl(CreateUrlRequest request);
    void deactivateUrl(UUID urlId);
    void activateUrl(UUID urlId);
    Page<UrlResponse> getUrls(String search, UrlFilterStatus status, Pageable pageable);
    List<UrlResponse> getExpiringSoon(int days);
    List<UrlResponse> getRecentUrls(int limit);
    Page<UrlResponse> getTopUrls(Pageable pageable);
    void deleteUrl(UUID urlId);


}
