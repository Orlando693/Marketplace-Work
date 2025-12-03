package com.troyecto.marketplace.services;
import com.troyecto.marketplace.dtos.user.UserRequest;
import com.troyecto.marketplace.dtos.user.UserResponse;
import java.util.List;


public interface UserService {
    UserResponse createUser(UserRequest userRequest);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, UserRequest userRequest);
    String deleteUser(Long id);
}