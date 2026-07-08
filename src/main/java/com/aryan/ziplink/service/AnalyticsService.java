package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.response.AnalyticsSummaryResponse;
import com.aryan.ziplink.dto.response.ClickEventResponse;
import com.aryan.ziplink.dto.response.UrlAnalyticsResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.entity.Url;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface AnalyticsService {
    void recordClick(
            Url url,
            HttpServletRequest request
    );

    UrlAnalyticsResponse getAnalytics(UUID urlId);

    Page<ClickEventResponse> getClickHistory(UUID urlId, Instant from, Instant to, Pageable pageable);

    AnalyticsSummaryResponse getSummary();
}
