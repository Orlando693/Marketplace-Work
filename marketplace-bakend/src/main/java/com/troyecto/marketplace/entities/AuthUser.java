package com.troyecto.marketplace.entities;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "authusers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    // 🔁 Refresh token actual asignado al usuario
    private String refreshToken;

    // ⏰ Fecha de expiración del refresh token
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date refreshTokenExpiry;
    /**
     * Rol del usuario (ejemplo: ROLE_ADMIN o ROLE_USER)
     */
    @Column(nullable = false)
    private String role = "ROLE_USER";
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Devuelve siempre una autoridad, para evitar problemas si el campo está vacío
        return List.of(new SimpleGrantedAuthority(role != null ? role : "ROLE_USER"));
    }
    /**
     * ✅ El username para Spring Security será el email
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * ✅ Indica si la cuenta está activa
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
