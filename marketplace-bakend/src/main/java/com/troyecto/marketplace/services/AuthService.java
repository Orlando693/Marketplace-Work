package com.troyecto.marketplace.services;

import com.troyecto.marketplace.dtos.auth.AuthenticationRequest;
import com.troyecto.marketplace.dtos.auth.AuthenticationResponse;
import com.troyecto.marketplace.dtos.auth.RegisterRequest;

/**
 * AuthService
 * -----------------------------------------------------
 * ✔ Define las operaciones públicas del servicio de autenticación
 */
public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    AuthenticationResponse createAdminUser(); // ✅ Añadido aquí
    AuthenticationResponse refreshToken(String refreshToken);
}
