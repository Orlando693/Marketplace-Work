// src/services/productService.ts
import { api } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  publishedDate: string;
  isAvailable: boolean;
  storeId: number;
  storeName: string;
  orderItemsId: number[];
  reviewsId: number[];
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  publishedDate?: string;
  isAvailable: boolean;
  storeId: number;
  storeName?: string;
}

export const getAllProducts = () => api.get<Product[]>("/products");
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`);
export const addProduct = (product: ProductRequest) => api.post<Product>("/products", product);
export const updateProduct = (id: number, product: ProductRequest) => 
  api.put<Product>(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
