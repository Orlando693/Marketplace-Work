package com.troyecto.marketplace.serviceimpls;
import com.troyecto.marketplace.dtos.product.ProductRequest;
import com.troyecto.marketplace.dtos.product.ProductResponse;
import com.troyecto.marketplace.entities.Product;
import com.troyecto.marketplace.entities.Store;
import com.troyecto.marketplace.exceptions.ResourceNotFoundException;
import com.troyecto.marketplace.mappers.ProductMapper;
import com.troyecto.marketplace.repositories.ProductRepository;
import com.troyecto.marketplace.repositories.StoreRepository;
import com.troyecto.marketplace.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ProductMapper productMapper;


    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {
        Store store=storeRepository.findById(productRequest.getStoreId())
                .orElseThrow(()->new ResourceNotFoundException("Store not found with id: "+productRequest.getStoreId()));
        Product product=productMapper.mapProductRequestToProduct(productRequest);
        product.setPublishedDate(LocalDateTime.now());
        product.setStore(store);
        Product savedProduct=productRepository.save(product);
        return productMapper.mapProductToProductResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product=productRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Product not found with id: "+id));
        Store store=storeRepository.findById(productRequest.getStoreId())
                .orElseThrow(()->new ResourceNotFoundException("Store not found with id: "+productRequest.getStoreId()));
        productMapper.updateProductFromRequest(productRequest,product);
        product.setStore(store);
        Product updatedProduct=productRepository.save(product);
        return productMapper.mapProductToProductResponse(updatedProduct);
    }


    @Override
    public String cancelProduct(Long id) {
        Product product=productRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Product not found with id: "+id));
        productRepository.delete(product);
        return "Product with id: "+id+" has been cancelled.";
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product=productRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Product not found with id: "+id));
        return productMapper.mapProductToProductResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::mapProductToProductResponse)
                .collect(Collectors.toList());
    }
}
