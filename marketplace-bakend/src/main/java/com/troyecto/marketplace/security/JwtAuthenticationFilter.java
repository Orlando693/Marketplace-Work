package com.troyecto.marketplace.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
/**
 * JwtAuthenticationFilter
 * -----------------------------------------------------
 * ✔ Intercepta todas las solicitudes HTTP
 * ✔ Extrae y valida el token JWT del encabezado Authorization
 * ✔ Autentica al usuario si el token es válido
 * ✔ Permite pasar la solicitud al siguiente filtro en la cadena
 */

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // No aplicar el filtro JWT a rutas públicas
        return path.startsWith("/api/auth/") || 
               path.equals("/api/users") ||
               path.startsWith("/api/orders") ||
               path.startsWith("/api/orderItems");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String username;

        // 🔍 Si no hay cabecera o no empieza con "Bearer ", continuar sin procesar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🧾 Extraer el token JWT (sin la palabra "Bearer ")
        jwt = authHeader.substring(7);
        
        // Si el token está vacío, continuar sin autenticar
        if (jwt.trim().isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

// 👤 Extraer usuario desde el token, manejando expiración / token inválido;
        try {
            username = jwtService.extractUsername(jwt);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // Token expirado -> devolvemos 401 para que el cliente actúe (refresh / logout)
            System.out.println("JWT expirado: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"JWT expired\",\"message\":\"Token has expired\"}");
            return;
        } catch (io.jsonwebtoken.JwtException e) {
            // Token mal formado, firma inválida, etc.
            System.out.println("JWT inválido: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid JWT\",\"message\":\"" + e.getMessage() + "\"}");
            return;
        }

// 🔐 Validar token si aún no hay autenticación en contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }


        // 🚀 Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

}
