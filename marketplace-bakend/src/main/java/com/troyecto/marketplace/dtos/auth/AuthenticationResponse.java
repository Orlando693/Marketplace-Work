package com.troyecto.marketplace.dtos.auth;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * AuthenticationResponse
 * -----------------------------------------------------
 * ✔ DTO de respuesta para login y registro
 * ✔ Devuelve token JWT y datos del usuario autenticado
 * ✔ Compatible con el frontend (React/Next.js)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    /**
     * Token JWT generado tras autenticación
     */
    private String token;
    private String refreshToken;
    private Long authuserId;
    private String email;
    private String firstname;
    private String lastname;
    private String role;
}
