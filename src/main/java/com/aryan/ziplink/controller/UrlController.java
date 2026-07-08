package com.aryan.ziplink.controller;

import com.aryan.ziplink.dto.request.CreateUrlRequest;
import com.aryan.ziplink.dto.response.AnalyticsSummaryResponse;
import com.aryan.ziplink.dto.response.ApiResponse;
import com.aryan.ziplink.dto.response.ClickEventResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.ratelimit.annotation.RateLimit;
import com.aryan.ziplink.ratelimit.enums.RateLimitType;
import com.aryan.ziplink.service.AnalyticsService;
import com.aryan.ziplink.service.UrlService;
import com.aryan.ziplink.util.ResponseUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/urls")
public class UrlController {
    private final UrlService urlService;
    private final AnalyticsService analyticsService;

    public UrlController(UrlService urlService, AnalyticsService analyticsService) {
        this.urlService = urlService;
        this.analyticsService = analyticsService;
    }

    @PostMapping
    @RateLimit(type = RateLimitType.CREATE_URL)
    public ResponseEntity<ApiResponse<UrlResponse>> createShortUrl(@Valid @RequestBody CreateUrlRequest request){
        UrlResponse response=urlService.createShortUrl(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        true,
                        "Short URL created successfully",
                        HttpStatus.CREATED.value(),
                        response
                ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUrl(@PathVariable UUID id){
        urlService.deleteUrl(id);
        return ResponseEntity.ok(ApiResponse.of(true,
                "URL deleted successfully",
                HttpStatus.OK.value(),
                null));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateUrl(@PathVariable UUID id){
        urlService.activateUrl(id);
        return ResponseEntity.ok(ApiResponse.of(true,
                "URL Activated Successfully",
                HttpStatus.OK.value(),
                null));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateUrl(@PathVariable UUID id){
        urlService.deactivateUrl(id);
        return ResponseEntity.ok(ApiResponse.of(true,
                "URL Deactivated Successfully",
                HttpStatus.OK.value(),
                null));
    }

    @GetMapping("/{id}/clicks")
    public ResponseEntity<ApiResponse<Page<ClickEventResponse>>> getClickHistory(@PathVariable UUID id,
                                                                                 @RequestParam(required = false)
                                                                                 Instant from,
                                                                                 @RequestParam(required = false)
                                                                                 Instant to,
                                                                                 @PageableDefault(size = 20)
                                                                                 Pageable pageable){
        Page<ClickEventResponse> history=analyticsService.getClickHistory(id,from,to,pageable);
        return ResponseEntity.ok(ApiResponse.of(true,
                "Click History fetched successfully",
                HttpStatus.OK.value(),
                history));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryResponse>> getSummary(){
        AnalyticsSummaryResponse summary=analyticsService.getSummary();

        return ResponseEntity.ok(ApiResponse.of(
                true,
                "Analytics Summary Fetched Successfully",
                HttpStatus.OK.value(),
                summary
        ));
    }
}
