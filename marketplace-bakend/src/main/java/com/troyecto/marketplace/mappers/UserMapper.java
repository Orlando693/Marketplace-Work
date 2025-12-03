package com.troyecto.marketplace.mappers;
import com.troyecto.marketplace.dtos.user.UserRequest;
import com.troyecto.marketplace.dtos.user.UserResponse;
import com.troyecto.marketplace.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import java.util.stream.Collectors;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface UserMapper {
    //DTO->ENTITY
    default User toEntity(UserRequest userRequest) {
        if(userRequest==null) return null;
        User user = new User();
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setRole(userRequest.getRole());
        user.setAddress(userRequest.getAddress());
        user.setPhone(userRequest.getPhone());
        return user;
    }
    default UserResponse toResponse(User user) {
        if(user==null) return null;
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        userResponse.setAddress(user.getAddress());
        userResponse.setPhone(user.getPhone());
        if(user.getOrders()!=null) {
            userResponse.setOrdersId(
                    user.getOrders().stream().
                            map(order -> order.getId()).
                            collect(Collectors.toList())
            );
        }
        if(user.getStores()!=null) {
            userResponse.setStoresId(
                    user.getStores().stream().
                            map(store -> store.getId()).
                            collect(Collectors.toList())
            );
        }
        if(user.getReviews()!=null) {
            userResponse.setReviewsId(
                    user.getReviews().stream().
                            map(review -> review.getId()).
                            collect(Collectors.toList())
            );
        }
        return userResponse;
    }
    default void updateUserFromDto(UserRequest userRequest, User user) {
        if(userRequest==null || user==null) return;
        if(userRequest.getFirstName()!=null && !userRequest.getFirstName().isBlank())
            user.setFirstName(userRequest.getFirstName());
        if(userRequest.getLastName()!=null && !userRequest.getLastName().isBlank())
            user.setLastName(userRequest.getLastName());
        if(userRequest.getEmail()!=null && !userRequest.getEmail().isBlank())
            user.setEmail(userRequest.getEmail());
        if(userRequest.getRole()!=null && !userRequest.getRole().isBlank())
            user.setRole(userRequest.getRole());
        if(userRequest.getAddress()!=null)
            user.setAddress(userRequest.getAddress());
        if(userRequest.getPhone()!=null)
            user.setPhone(userRequest.getPhone());
    }

}