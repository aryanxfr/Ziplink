package com.aryan.ziplink.mapper;

import com.aryan.ziplink.dto.response.ClickEventResponse;
import com.aryan.ziplink.dto.response.UrlAnalyticsResponse;
import com.aryan.ziplink.entity.ClickEvent;
import com.aryan.ziplink.entity.Url;
import org.mapstruct.Mapper;
import org.w3c.dom.ls.LSInput;

import java.util.List;

@Mapper(componentModel="spring")
public interface AnalyticsMapper {
    ClickEventResponse toResponse(
            ClickEvent clickEvent
    );

    List<ClickEventResponse> toResponseList(
            List<ClickEvent> clickEvents
    );

    default UrlAnalyticsResponse toAnalyticsResponse(
            Url url,
            String shortUrl,
            long uniqueVisitors,
            List<ClickEventResponse> recentClicks
    ) {
        return new UrlAnalyticsResponse(
                url.getId(),
                url.getOriginalUrl(),
                url.getShortCode(),
                shortUrl,
                url.getClickCount(),
                url.getActive(),
                url.getExpiresAt(),
                recentClicks,
                uniqueVisitors
                );
    }
}
