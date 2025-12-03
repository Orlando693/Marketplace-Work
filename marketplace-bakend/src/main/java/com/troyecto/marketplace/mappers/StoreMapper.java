package com.troyecto.marketplace.mappers;


import com.troyecto.marketplace.dtos.store.StoreRequest;
import com.troyecto.marketplace.dtos.store.StoreResponse;
import com.troyecto.marketplace.entities.Store;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
 // Para que Spring pueda inyectarlo
public interface StoreMapper {
    //DTO to Entity
    default Store toEntity(StoreRequest storeRequest) {
        if(storeRequest == null) {
            return null;
        }
        Store store = new Store();
        store.setName(storeRequest.getName());
        store.setDescription(storeRequest.getDescription());
        store.setCategory(storeRequest.getCategory());
        store.setIsActive(storeRequest.getIsActive());
        return store;
    }
    default StoreResponse toResponse(Store store) {
        if(store == null) {
            return null;
        }
        StoreResponse storeResponse = new StoreResponse();
        storeResponse.setId(store.getId());
        storeResponse.setName(store.getName());
        storeResponse.setDescription(store.getDescription());
        storeResponse.setCategory(store.getCategory());
        storeResponse.setIsActive(store.getIsActive());
        storeResponse.setCreatedDate(store.getCreatedDate());
        if(store.getUser() != null) {
            storeResponse.setUserId(store.getUser().getId());
        }
        if(store.getProducts() != null) {
            storeResponse.setProductIds(store.getProducts()
                    .stream()
                    .map(Product-> Product.getId())
                    .collect(Collectors.toList()));
        }else{
            storeResponse.setProductIds(new ArrayList<>());
        }
        return storeResponse;
    }
    default void updateEntityFromRequest(StoreRequest storeRequest, Store store) {
        if (storeRequest == null || store == null) {
            return;
        }
        if (storeRequest.getName() != null) {
            store.setName(storeRequest.getName());
        }
        if (storeRequest.getDescription() != null) {
            store.setDescription(storeRequest.getDescription());
        }
        if (storeRequest.getCategory() != null) {
            store.setCategory(storeRequest.getCategory());
        }
        if (storeRequest.getIsActive() != null) {
            store.setIsActive(storeRequest.getIsActive());
        }
    }

}