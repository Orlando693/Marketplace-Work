// src/services/orderItemService.ts
import { api } from "./api";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  orderId: number;
  productId: number;
  productName: string;
}

export interface OrderItemRequest {
  quantity: number;
  price: number;
  subtotal: number;
  orderId: number;
  productId: number;
  productName: string;
}

export const getAllOrderItems = () => api.get<OrderItem[]>("/orderItems");
export const getOrderItem = (id: number) => api.get<OrderItem>(`/orderItems/${id}`);
export const addOrderItem = (orderItem: OrderItemRequest) => 
  api.post<OrderItem>("/orderItems", orderItem);
export const updateOrderItem = (id: number, orderItem: OrderItemRequest) => 
  api.put<OrderItem>(`/orderItems/${id}`, orderItem);
export const deleteOrderItem = (id: number) => api.delete(`/orderItems/${id}`);
