// src/services/storeService.ts
import { api } from "./api";

export interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdDate: string;
  userId: number;
  productIds: number[];
  userName?: string;
}

export interface StoreRequest {
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  userId: number;
}

export const getAllStores = () => api.get<Store[]>("/stores");
export const getStore = (id: number) => api.get<Store>(`/stores/${id}`);
export const addStore = (store: StoreRequest) => api.post<Store>("/stores", store);
export const updateStore = (id: number, store: StoreRequest) => 
  api.put<Store>(`/stores/${id}`, store);
export const deleteStore = (id: number) => api.delete(`/stores/${id}`);
