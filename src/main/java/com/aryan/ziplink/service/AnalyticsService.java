package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsService {
    void recordClick(
            UUID urlId,
            HttpServletRequest request
    );

    UrlAnalyticsResponse getAnalytics(UUID urlId);

    Page<ClickEventResponse> getClickHistory(UUID urlId, Instant from, Instant to, Pageable pageable);

    AnalyticsSummaryResponse getSummary();

    List<DeviceBreakdownResponse> getDeviceBreakdown(UUID urlId);
    List<DeviceBreakdownResponse> getBrowserBreakdown(UUID urlId);
    List<DeviceBreakdownResponse> getReferrerBreakdown(UUID urlId);
}
