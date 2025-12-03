package com.troyecto.marketplace.dtos.user;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "First Name cannot be null")
    private String firstName;
    @NotBlank(message = "Last Name cannot be null")
    private String lastName;
    // Nota: usar Long para phone puede estar bien, pero en muchos casos es mejor String
    // para preservar ceros a la izquierda y símbolos internacionales.
    @NotNull(message = "Phone number cannot be null")
    @Pattern(
            regexp = "\\d{8}",
            message = "Phone must have exactly 8 numeric digits"
    )
    private String phone;
    @NotBlank(message = "Address cannot be null")
    private String address;
    @NotBlank(message = "Email cannot be null")
    @Email(message = "Must provide a valid email")
    private String email;
    @NotBlank(message = "Role cannot be null")
    private String role;
}
