package com.aryan.ziplink.service.impl;

import com.aryan.ziplink.dto.response.AnalyticsSummaryResponse;
import com.aryan.ziplink.dto.response.ClickEventResponse;
import com.aryan.ziplink.dto.response.UrlAnalyticsResponse;
import com.aryan.ziplink.dto.response.UrlResponse;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private final UrlRepository urlRepository;
    private final AnalyticsMapper analyticsMapper;
    private final UrlBuilder urlBuilder;
    private final ClickEventRepository clickEventRepository;
    private final UrlMapper urlMapper;
    public AnalyticsServiceImpl(UrlRepository urlRepository, AnalyticsMapper analyticsMapper, UrlBuilder urlBuilder, ClickEventRepository clickEventRepository, UrlMapper urlMapper) {
        this.urlRepository = urlRepository;
        this.analyticsMapper = analyticsMapper;
        this.urlBuilder = urlBuilder;
        this.clickEventRepository = clickEventRepository;
        this.urlMapper = urlMapper;
    }
    @Override
    public void recordClick(Url url, HttpServletRequest request) {
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
        List<ClickEvent> allClickEvents=clickEventRepository.findByUrl(url);
        Set<String> uniqueIps=new HashSet<>();
        for(int i=0;i<allClickEvents.size();i++){
            ClickEvent event=allClickEvents.get(i);
            if(event.getIpAddress()!=null){
                uniqueIps.add(event.getIpAddress());
            }
        }
        return analyticsMapper.toAnalyticsResponse(
                url,
                urlBuilder.buildShortUrl(url.getShortCode()),
                        uniqueIps.size(),
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
        long totalUrls= urlRepository.countByUser(currentUser);
        long activeUrls=urlRepository.countByUserAndActiveTrue(currentUser);
        long inactiveUrls=urlRepository.countByUserAndActiveFalse(currentUser);
        List<Url> urls=urlRepository.findByUser(currentUser);
        long expiredUrls=0;
        long totalClick=0;
        Instant now=Instant.now();
        for(int i=0;i<urls.size();i++){
            Url url=urls.get(i);
            totalClick+=url.getClickCount();
            if(url.getExpiresAt()!=null && url.getExpiresAt().isBefore(now)){
                expiredUrls++;
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
}
