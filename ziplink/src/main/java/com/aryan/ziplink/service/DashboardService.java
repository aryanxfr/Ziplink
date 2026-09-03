package com.aryan.ziplink.service;

import com.aryan.ziplink.dto.response.DashboardSummaryResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.enums.UrlFilterStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DashboardService {
    DashboardSummaryResponse getDashboardSummary();
//    Page<UrlResponse> getUrls(String search, UrlFilterStatus status, Pageable pageable);
//    List<UrlResponse> getExpiringSoon(int days);
//    List<UrlResponse> getRecentUrls(int limit);
//    Page<UrlResponse> getTopUrls(Pageable pageable);
}
