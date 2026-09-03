package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.response.AnalyticsSummaryResponse;
import com.aryan.ziplink.dto.response.ClickEventResponse;
import com.aryan.ziplink.dto.response.DeviceBreakdownResponse;
import com.aryan.ziplink.dto.response.UrlAnalyticsResponse;
import com.aryan.ziplink.entity.ClickEvent;
import com.aryan.ziplink.entity.Url;
import com.aryan.ziplink.exception.BadRequestException;
import com.aryan.ziplink.exception.ForbiddenException;
import com.aryan.ziplink.exception.ResourceNotFoundException;
import com.aryan.ziplink.mapper.AnalyticsMapper;
import com.aryan.ziplink.mapper.UrlMapper;
import com.aryan.ziplink.repository.ClickEventRepository;
import com.aryan.ziplink.repository.UrlRepository;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.util.RequestUtils;
import com.aryan.ziplink.util.SecurityUtils;
import com.aryan.ziplink.util.UrlBuilder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private final UrlRepository urlRepository;
    private final AnalyticsMapper analyticsMapper;
    private final UrlBuilder urlBuilder;
    private final ClickEventRepository clickEventRepository;
    public AnalyticsServiceImpl(UrlRepository urlRepository, AnalyticsMapper analyticsMapper, UrlBuilder urlBuilder, ClickEventRepository clickEventRepository, UrlMapper urlMapper) {
        this.urlRepository = urlRepository;
        this.analyticsMapper = analyticsMapper;
        this.urlBuilder = urlBuilder;
        this.clickEventRepository = clickEventRepository;
    }

    @Override
    public void recordClick(UUID urlId, HttpServletRequest request) {
        Url url = urlRepository.getReferenceById(urlId);
        var clickEvent= ClickEvent.builder()
                .url(url)
                .ipAddress(RequestUtils.getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .referer(request.getHeader("Referer"))
                .clickedAt(Instant.now())
                .build();
        clickEventRepository.save(clickEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public UrlAnalyticsResponse getAnalytics(UUID urlId) {
        var url=urlRepository.findById(urlId)
                .orElseThrow(()-> new ResourceNotFoundException("URL not found"));
        var currentUser= SecurityUtils.currentUser();
        if(!url.getUser().getId().equals(currentUser.getId())){
            throw new ForbiddenException("You are not allowed to access this URL");
        }
        List<ClickEvent> clickEvents=clickEventRepository.findTop10ByUrlOrderByClickedAtDesc(url);
        List<ClickEventResponse> recentClicks= analyticsMapper.toResponseList(clickEvents);
        long uniqueVisitors = clickEventRepository.countDistinctVisitorsByUrl(url);
        return analyticsMapper.toAnalyticsResponse(
                url,
                urlBuilder.buildShortUrl(url.getShortCode()),
                        uniqueVisitors,
                        recentClicks);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClickEventResponse> getClickHistory(UUID urlId, Instant from, Instant to, Pageable pageable) {
         var url=urlRepository.findById(urlId)
                 .orElseThrow(()-> new ResourceNotFoundException("URL not found"));
         var currentUser=SecurityUtils.currentUser();
         if(!url.getUser().getId().equals(currentUser.getId())){
             throw new ForbiddenException("You are not allowed to access this URL");
         }
         if((from==null) != (to==null)){
            throw new BadRequestException("Both 'from' and 'to' must be provided together.");
         }
         if(from!=null && from.isAfter(to)){
            throw new BadRequestException("'from' must be before 'to'.");
         }
         Page<ClickEvent> clickEvents;
         if(from != null){
             clickEvents=clickEventRepository.findByUrlAndClickedAtBetweenOrderByClickedAtDesc(url,
                     from,
                     to,
                     pageable);
         }else{
             clickEvents=clickEventRepository.findByUrlOrderByClickedAtDesc(url,pageable);
         }
         return clickEvents.map(analyticsMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary() {
        var currentUser=SecurityUtils.currentUser();
        List<Url> urls=urlRepository.findByUser(currentUser);
        long totalUrls = urls.size();
        long activeUrls = 0;
        long inactiveUrls = 0;
        long expiredUrls = 0;
        long totalClick = 0;
        Instant now = Instant.now();
        for (Url url : urls) {
            totalClick += url.getClickCount();
            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(now)) {
                expiredUrls++;
            } else if (Boolean.TRUE.equals(url.getActive())) {
                activeUrls++;
            } else {
                inactiveUrls++;
            }
        }
        return new AnalyticsSummaryResponse(
                totalUrls,
                activeUrls,
                inactiveUrls,
                expiredUrls,
                totalClick
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceBreakdownResponse> getDeviceBreakdown(UUID urlId) {
        List<ClickEvent> events = clickEventRepository.findByUrlId(urlId);
        java.util.Map<String, Long> deviceCounts = new java.util.LinkedHashMap<>();
        for (ClickEvent event : events) {
            String ua = event.getUserAgent();
            String deviceType = "Desktop";
            if (ua != null) {
                if (ua.contains("Mobile") || ua.contains("Android") || ua.contains("iPhone")) {
                    deviceType = "Mobile";
                } else if (ua.contains("Tablet") || ua.contains("iPad")) {
                    deviceType = "Tablet";
                }
            }
            deviceCounts.merge(deviceType, 1L, Long::sum);
        }
        return deviceCounts.entrySet().stream()
                .map(e -> new DeviceBreakdownResponse(e.getKey(), e.getValue()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceBreakdownResponse> getBrowserBreakdown(UUID urlId) {
        List<ClickEvent> events = clickEventRepository.findByUrlId(urlId);
        java.util.Map<String, Long> browserCounts = new java.util.LinkedHashMap<>();
        for (ClickEvent event : events) {
            String ua = event.getUserAgent();
            String browser = "Other";
            if (ua != null) {
                if (ua.contains("Edg")) browser = "Edge";
                else if (ua.contains("OPR") || ua.contains("Opera")) browser = "Opera";
                else if (ua.contains("Chrome")) browser = "Chrome";
                else if (ua.contains("Firefox")) browser = "Firefox";
                else if (ua.contains("Safari")) browser = "Safari";
            }
            browserCounts.merge(browser, 1L, Long::sum);
        }
        return browserCounts.entrySet().stream()
                .map(e -> new DeviceBreakdownResponse(e.getKey(), e.getValue()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceBreakdownResponse> getReferrerBreakdown(UUID urlId) {
        List<ClickEvent> events = clickEventRepository.findByUrlId(urlId);
        java.util.Map<String, Long> counts = new java.util.HashMap<>();
        for (ClickEvent event : events) {
            String ref = event.getReferer();
            String domain = "Direct";
            if (ref != null && !ref.isBlank()) {
                try {
                    java.net.URI uri = new java.net.URI(ref);
                    if (uri.getHost() != null) {
                        domain = uri.getHost();
                    }
                } catch (Exception e) {
                    domain = "Direct";
                }
            }
            counts.put(domain, counts.getOrDefault(domain, 0L) + 1);
        }
        return counts.entrySet().stream()
                .map(e -> new DeviceBreakdownResponse(e.getKey(), e.getValue()))
                .toList();
    }
}
