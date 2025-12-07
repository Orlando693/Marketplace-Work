import { api } from "./api";

export interface Order {
  id: number;
  userName: string;
  orderDate: string;
  totalAmount: number;
  tax: number;
  currency: string;
  payMethod: string;
  paymentStatus: string;
  subtotal: number;
  userId: number;
}

export interface OrderRequest {
  subtotal: number;
  totalAmount: number;
  tax: number;
  currency: string;
  payMethod: string;
  paymentStatus: string;
  userId: number;
}

export const getAllOrders = () => api.get<Order[]>("/orders");
export const getOrder = (id: number) => api.get<Order>(`/orders/${id}`);
export const addOrder = (order: OrderRequest) => api.post<Order>("/orders", order);
export const updateOrder = (id: number, order: OrderRequest) =>
  api.put<Order>(`/orders/${id}`, order);
export const deleteOrder = (id: number) => api.delete(`/orders/${id}`);
