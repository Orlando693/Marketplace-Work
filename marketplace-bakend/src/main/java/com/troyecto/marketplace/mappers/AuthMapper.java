package com.troyecto.marketplace.mappers;

import com.troyecto.marketplace.dtos.auth.AuthUserResponse;
import com.troyecto.marketplace.entities.AuthUser;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public static AuthUserResponse toUserResponse(AuthUser user) {
        return AuthUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
