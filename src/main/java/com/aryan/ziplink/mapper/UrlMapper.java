package com.aryan.ziplink.mapper;

import com.aryan.ziplink.dto.request.CreateUrlRequest;
import com.aryan.ziplink.dto.response.UrlResponse;
import com.aryan.ziplink.entity.Url;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel="spring")
public interface UrlMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "shortCode", ignore = true)
    @Mapping(target = "clickCount", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "clickEvents", ignore = true)

    Url toEntity(CreateUrlRequest request);

    default UrlResponse toResponse(Url url, String shortUrl){
        return new UrlResponse(
                url.getId(),
                url.getOriginalUrl(),
                url.getShortCode(),
                shortUrl,
                url.getClickCount(),
                url.getExpiresAt(),
                url.getActive()
        );
    }

}
