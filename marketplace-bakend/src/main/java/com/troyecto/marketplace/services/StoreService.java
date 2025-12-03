package com.troyecto.marketplace.services;
import com.troyecto.marketplace.dtos.store.StoreRequest;
import com.troyecto.marketplace.dtos.store.StoreResponse;
import java.util.List;

public interface StoreService {
    StoreResponse RegisterNewStore(StoreRequest storeRequest);
    StoreResponse getStoreById(Long id);
    StoreResponse UpdateStore(Long id, StoreRequest storeRequest);
    String DeleteStore(Long id);
    List<StoreResponse> getStores();
}
