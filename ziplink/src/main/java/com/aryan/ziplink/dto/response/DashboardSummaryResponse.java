package com.aryan.ziplink.dto.response;

import java.util.List;

public record DashboardSummaryResponse(
        AnalyticsSummaryResponse analytics,

        List<UrlResponse> recentUrls,

        List<UrlResponse> topUrls,

        List<UrlResponse> expiringSoon
){
}
