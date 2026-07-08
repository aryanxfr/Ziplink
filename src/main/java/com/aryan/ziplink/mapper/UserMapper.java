package com.aryan.ziplink.mapper;

import com.aryan.ziplink.dto.request.RegisterRequest;
import com.aryan.ziplink.dto.response.UserResponse;
import com.aryan.ziplink.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel="spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "urls", ignore = true)
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}
