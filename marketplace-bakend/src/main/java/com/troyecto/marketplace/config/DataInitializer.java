package com.troyecto.marketplace.config;

import com.troyecto.marketplace.entities.AuthUser;
import com.troyecto.marketplace.repositories.AuthUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer
 * -----------------------------------------------------
 * ✅ Crea usuarios de prueba al iniciar la aplicación
 * ✅ Solo los crea si no existen (evita duplicados)
 * ✅ Contraseñas encriptadas con BCrypt
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createTestUsers();
    }

    private void createTestUsers() {
        // Usuario Admin
        if (!authUserRepository.findByEmail("admin@test.com").isPresent()) {
            AuthUser admin = new AuthUser();
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstname("Admin");
            admin.setLastname("Sistema");
            admin.setRole("ROLE_ADMIN");
            authUserRepository.save(admin);
            System.out.println("✅ Usuario admin creado: admin@test.com / admin123");
        }

        // Usuario Normal
        if (!authUserRepository.findByEmail("user@test.com").isPresent()) {
            AuthUser user = new AuthUser();
            user.setEmail("user@test.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstname("Usuario");
            user.setLastname("Prueba");
            user.setRole("ROLE_USER");
            authUserRepository.save(user);
            System.out.println("✅ Usuario normal creado: user@test.com / user123");
        }
    }
}
