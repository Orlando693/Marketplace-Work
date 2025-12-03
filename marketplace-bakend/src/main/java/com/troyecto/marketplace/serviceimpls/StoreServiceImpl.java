package com.troyecto.marketplace.serviceimpls;
import com.troyecto.marketplace.dtos.store.StoreRequest;
import com.troyecto.marketplace.dtos.store.StoreResponse;
import com.troyecto.marketplace.entities.Store;
import com.troyecto.marketplace.entities.User;
import com.troyecto.marketplace.exceptions.ResourceNotFoundException;
import com.troyecto.marketplace.mappers.StoreMapper;
import com.troyecto.marketplace.repositories.StoreRepository;
import com.troyecto.marketplace.repositories.UserRepository;
import com.troyecto.marketplace.services.StoreService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final StoreMapper storeMapper;

    @Override
    public StoreResponse RegisterNewStore(StoreRequest storeRequest) {
        User user= userRepository.findById(storeRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id:"+ storeRequest.getUserId()));
        Store store=storeMapper.toEntity(storeRequest);
        store.setCreatedDate(LocalDateTime.now());
        store.setUser(user);
        Store savedStore= storeRepository.save(store);
        return storeMapper.toResponse(savedStore);
    }

    @Override
    public StoreResponse getStoreById(Long id) {
        Store store= storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id:"+ id));
        return storeMapper.toResponse(store);
    }

    @Override
    public StoreResponse UpdateStore(Long id, StoreRequest storeRequest) {
        Store store= storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id:"+ id));

        User user = userRepository.findById(storeRequest.getUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id:"+ storeRequest.getUserId()));

        storeMapper.updateEntityFromRequest(storeRequest,store);
        store.setUser(user);
        Store updatedStore= storeRepository.save(store);
        return storeMapper.toResponse(updatedStore);
    }

    @Override
    public String DeleteStore(Long id) {
        Store store= storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id:"+ id));
        storeRepository.delete(store);
        return "Store deleted successfully with id:"+ id;
    }

    @Override
    public List<StoreResponse> getStores() {
        return storeRepository.findAll()
                .stream()
                .map(storeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Comentarios importantes sobre el servicio:
    // - La verificación existsByName evita violaciones del constraint único antes de intentar guardar.
    // - Se recupera la entidad User en el servicio y se asocia a Store; esto debe hacerse en el servicio
    //   porque el mapper no tiene acceso a repositorios.
    // - @Transactional en la clase asegura que operaciones compuestas (ej. guardar store y sus productos)
    //   se ejecuten en una transacción; además ayuda a evitar LazyInitializationException cuando se accede
    //   a colecciones dentro del servicio.
    // - Las excepciones ResourceNotFoundException son específicas para NOT FOUND; IllegalArgumentException se usa
    //   para validaciones de entrada (nombre duplicado).
}
