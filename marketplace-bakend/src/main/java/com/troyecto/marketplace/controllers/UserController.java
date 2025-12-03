// Ubicación: src/main/java/com/troyecto/marketplace/controllers/UserController.java
package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.user.UserRequest;
import com.troyecto.marketplace.dtos.user.UserResponse;
import com.troyecto.marketplace.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le dice a Spring que esta clase es un controlador que manejará peticiones REST.
@RequestMapping("/api/users") // Define la URL base para todos los endpoints en esta clase.
@CrossOrigin("*")
@AllArgsConstructor // Genera un constructor para inyección; combinar @AllArgsConstructor y @Autowired en campo es redundante.
public class UserController {

    // Inyectamos el servicio que tiene toda la lógica de negocio.
    @Autowired
    private UserService userService;
    // Endpoint para CREAR un usuario.
    // Se activa con una petición POST a http://localhost:8080/api/users
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest userRequest) {
        // Comentario:
        // - Aquí se recomienda usar @Valid en el parámetro y anotar UserDTO con constraints para validación automática.
        UserResponse savedUser = userService.createUser(userRequest);
        return ResponseEntity.ok(ApiResponse.ok("User creado con exito",savedUser)); // Devuelve el usuario creado y un código 201.
    }

    // Endpoint para OBTENER TODOS los usuarios.
    // Se activa con una petición GET a http://localhost:8080/api/users
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Lista encontrad",users)); // Devuelve la lista y un código 200.
    }

     @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return  ResponseEntity.ok(ApiResponse.ok("Usuario encontrado",user)); // Devuelve el usuario y un código 200.
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid@RequestBody UserRequest userDetails) {
        // Comentario:
        // - Al actualizar colecciones (orders/reviews/stores) hay que considerar la estrategia (reemplazo total vs. parcial).
        UserResponse updatedUser = userService.updateUser(id, userDetails);
        return  ResponseEntity.ok(ApiResponse.ok("Usuario actualizado",updatedUser)); // Devuelve el usuario actualizado y un código 200.
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String message = userService.deleteUser(id);
        return  ResponseEntity.ok(message); // Devuelve un mensaje de éxito y un código 200.
    }
}