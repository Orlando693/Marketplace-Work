package com.troyecto.marketplace.security;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig
 * -----------------------------------------------------
 * ✔ Configura Spring Security con JWT
 * ✔ Deshabilita CSRF (porque usamos token)
 * ✔ Aplica CORS global desde CorsConfig
 * ✔ Protege rutas excepto /api/auth/**
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ✅ Habilitar CORS global (configurado en CorsConfig)
                .cors(cors -> cors.configure(http))
                // ❌ Desactivar CSRF (no se usa con JWT)
                .csrf(AbstractHttpConfigurer::disable)
                // ✅ Definir rutas públicas y protegidas

                .authorizeHttpRequests(auth -> auth
                        // Rutas de autenticación públicas
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/refresh"
                        ).permitAll()
                        // Permitir crear y listar usuarios sin autenticación
                        .requestMatchers("/api/users").permitAll()
                        // Requiere autenticación para ver perfil
                        .requestMatchers("/api/auth/me").authenticated()
                        // Todas las demás rutas requieren autenticación
                        .anyRequest().authenticated()
                )

                // ✅ Política de sesión sin estado
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // ✅ Registrar el AuthenticationProvider
                .authenticationProvider(authenticationProvider)
                // ✅ Registrar el filtro JWT antes del UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
