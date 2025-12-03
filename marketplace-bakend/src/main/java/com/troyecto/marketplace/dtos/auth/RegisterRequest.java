package com.troyecto.marketplace.dtos.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RegisterRequest
 * -----------------------------------------------------
 * ✔ DTO para registro de nuevos usuarios
 * ✔ Compatible con el frontend (React/Next.js)
 * ✔ Usado en /api/auth/register
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @JsonProperty("firstname")
    @NotBlank(message = "First name is required")
    private String firstName;
    @JsonProperty("lastname")
    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Must provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
