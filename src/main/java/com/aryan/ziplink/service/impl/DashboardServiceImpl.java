package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.response.AnalyticsSummaryResponse;
import com.aryan.ziplink.dto.response.DashboardSummaryResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.enums.UrlFilterStatus;
import com.aryan.ziplink.mapper.UrlMapper;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.service.DashboardService;
import com.aryan.ziplink.service.UrlService;
import com.aryan.ziplink.util.SecurityUtils;
import com.aryan.ziplink.util.UrlBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
@Service
public class DashboardServiceImpl implements DashboardService {
    private final AnalyticsService analyticsService;
    private final UrlRepository urlRepository;
    private final UrlMapper urlMapper;
    private final UrlBuilder urlBuilder;
    private final UrlService urlService;

    public DashboardServiceImpl(AnalyticsService analyticsService,
                                UrlRepository urlRepository,
                                UrlMapper urlMapper,
                                UrlBuilder urlBuilder, UrlService urlService) {
        this.analyticsService = analyticsService;
        this.urlRepository = urlRepository;
        this.urlMapper = urlMapper;
        this.urlBuilder = urlBuilder;
        this.urlService = urlService;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        var currentUser = SecurityUtils.currentUser();
        AnalyticsSummaryResponse analytics = analyticsService.getSummary();
        List<UrlResponse> recentUrls = urlRepository
                .findTop10ByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())))
                .toList();
        List<UrlResponse> topUrls = urlRepository
                .findTop10ByUserOrderByClickCountDesc(currentUser)
                .stream()
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(
                                url.getShortCode()
                        )
                ))
                .toList();

        List<UrlResponse> expiringSoon = urlRepository
                .findTop10ByUserAndExpiresAtAfterOrderByExpiresAtAsc(currentUser, Instant.now())
                .stream()
                .map(url -> urlMapper.toResponse(
                        url,
                        urlBuilder.buildShortUrl(url.getShortCode())))
                .toList();
        return new DashboardSummaryResponse(analytics,
                recentUrls,
                topUrls,
                expiringSoon);
    }
}

//    @Override
//    public Page<UrlResponse> getUrls(String search, UrlFilterStatus status, Pageable pageable) {
//        return urlService.getUrls(
//                search,
//                status,
//                pageable
//        );
//    }
//
//    @Override
//    public List<UrlResponse> getExpiringSoon(int days) {
//        return urlService.getExpiringSoon(days);
//    }
//
//    @Override
//    public List<UrlResponse> getRecentUrls(int limit) {
//        return urlService.getRecentUrls(limit);
//    }
//
//    @Override
//    public Page<UrlResponse> getTopUrls(Pageable pageable) {
//        return urlService.getTopUrls(pageable);
//    }
//}
