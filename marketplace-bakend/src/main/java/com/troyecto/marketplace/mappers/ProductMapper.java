package com.troyecto.marketplace.mappers;

import com.troyecto.marketplace.dtos.product.ProductRequest;
import com.troyecto.marketplace.dtos.product.ProductResponse;
import com.troyecto.marketplace.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;

import java.util.stream.Collectors;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    // ✅ DTO → Entity
    default Product mapProductRequestToProduct(ProductRequest productRequest) {
        if(productRequest == null) return null;
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStock(productRequest.getStock());
        product.setIsAvailable(productRequest.getIsAvailable());
        return product;

    }
    // ✅ Entity → DTO
    default ProductResponse mapProductToProductResponse(Product product) {
        if(product == null) return null;
        ProductResponse productResponse = new ProductResponse();
        productResponse.setId(product.getId());
        productResponse.setName(product.getName());
        productResponse.setDescription(product.getDescription());
        productResponse.setPrice(product.getPrice());
        productResponse.setStock(product.getStock());
        productResponse.setIsAvailable(product.getIsAvailable());
        productResponse.setPublishedDate(product.getPublishedDate());
        // Mapear storeId
        if(product.getStore() != null){
            productResponse.setStoreId(product.getStore().getId());
            productResponse.setStoreName(product.getStore().getName());
        }
        // Mapear reviewIds
        if(product.getReviews() != null){
            productResponse.setReviewsId(
                    product.getReviews().stream().
                            map(Review->Review.getId()).
                            collect(Collectors.toList())
            );
        }else{
            productResponse.setReviewsId(new ArrayList<>());
        }
        if(product.getOrderItems() != null){
            productResponse.setOrderItemsId(
                    product.getOrderItems().stream().
                            map(OrderItem->OrderItem.getId()).
                            collect(Collectors.toList())
            );
        }else{
            productResponse.setOrderItemsId(new ArrayList<>());
        }
        return productResponse;
    }
    default void updateProductFromRequest(ProductRequest productRequest, Product product) {
        if (productRequest == null || product == null) {
            return;
        }
        if (productRequest.getName() != null) {
            product.setName(productRequest.getName());
        }
        if (productRequest.getDescription() != null) {
            product.setDescription(productRequest.getDescription());
        }
        if (productRequest.getPrice() != null) {
            product.setPrice(productRequest.getPrice());
        }
        if (productRequest.getStock() != null) {
            product.setStock(productRequest.getStock());
        }
        if (productRequest.getIsAvailable() != null) {
            product.setIsAvailable(productRequest.getIsAvailable());
        }
    }

}
