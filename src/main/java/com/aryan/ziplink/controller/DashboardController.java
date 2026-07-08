package com.aryan.ziplink.controller;

import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.DashboardSummaryResponse;
import com.aryan.ziplink.dto.response.UrlAnalyticsResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.enums.UrlFilterStatus;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.service.DashboardService;
import com.aryan.ziplink.service.UrlService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final UrlService urlService;
    private final AnalyticsService analyticsService;
    public DashboardController(DashboardService dashboardService, UrlService urlService, AnalyticsService analyticsService) {
        this.dashboardService = dashboardService;
        this.urlService = urlService;
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboard(){
        return ResponseEntity.ok(ApiResponse.of(true,
                "Dashboard fetched Successfully",
                HttpStatus.OK.value(),
                dashboardService.getDashboardSummary()));
    }

    @GetMapping("/urls")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getUrls(@RequestParam(required = false) String search,
                                                                  @RequestParam(required = false) UrlFilterStatus status,
                                                                  @PageableDefault(size = 10,sort = "createdAt",
                                                                  direction = Sort.Direction.DESC)
                                                                  Pageable pageable){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "URLs fetched successfully",
                HttpStatus.OK.value(),
                urlService.getUrls(search,status,pageable)
        ));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getExpiringSoon(
            @RequestParam(defaultValue = "7")int days
    ){
        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Expiring URLs fetched successfully.",
                        HttpStatus.OK.value(),
                        urlService.getExpiringSoon(days)
                )
        );
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<UrlResponse>>> getRecentUrls(
            @RequestParam(defaultValue = "10")
            int limit
    ){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Recent URLs fetched successfully",
                HttpStatus.OK.value(),
                urlService.getRecentUrls(limit)
        ));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<Page<UrlResponse>>> getTopUrls(@PageableDefault(size = 10)
                                                                     Pageable pageable){
        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Top URLs fetched successfully",
                HttpStatus.OK.value(),
                urlService.getTopUrls(pageable)
        ));
    }

    @GetMapping("/urls/{id}/analytics")
    public ResponseEntity<ApiResponse<UrlAnalyticsResponse>> getAnalytics(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                ApiResponse.of(
                        true,
                        "Analytics fetched successfully.",
                        HttpStatus.OK.value(),
                        analyticsService.getAnalytics(id)
                )
        );
    }
}
