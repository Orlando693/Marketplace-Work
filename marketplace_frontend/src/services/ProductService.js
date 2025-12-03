import axios from "axios";

// URLs base de los recursos, siguiendo la arquitectura Spring Boot
const API_URL = "http://localhost:8080/api/products";
const STORE_URL = "http://localhost:8080/api/stores";

/**
 * Servicio que encapsula las llamadas HTTP (Axios) para el recurso 'Product'.
 * Utiliza las URLs definidas y el formato RESTful para enviar/recibir DTOs.
 */

// Obtiene todos los productos
export const getAllProducts = () => {
    // API: GET http://localhost:8080/api/products
    return axios.get(API_URL);
}

// Obtiene un producto por ID
export const getProductById = (id) => {
    // API: GET http://localhost:8080/api/products/{id}
    return axios.get(`${API_URL}/${id}`);
}

// Crea un nuevo producto (incluye Category DTO dentro del payload)
export const createProduct = (product) => {
    // API: POST http://localhost:8080/api/products
    return axios.post(API_URL, product);
}

// Actualiza un producto existente (incluye Category DTO dentro del payload)
export const updateProduct = (id, product) => {
    // API: PUT http://localhost:8080/api/products/{id}
    return axios.put(`${API_URL}/${id}`, product);
}

// Elimina un producto por ID
export const deleteProduct = (id) => {
    // API: DELETE http://localhost:8080/api/products/{id}
    return axios.delete(`${API_URL}/${id}`);
}

// Obtiene todas las tiendas (Función auxiliar para selectores, por ejemplo)
export const getStores = () => {
    // API: GET http://localhost:8080/api/stores
    return axios.get(STORE_URL);
}