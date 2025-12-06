// src/services/UserService.ts
import { api } from "./api";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export const getAllUsers = () => api.get<User[]>("/users");
export const getUser = (id: number) => api.get<User>(`/users/${id}`);
export const addUser = (user: UserRequest) => api.post<User>("/users", user);
export const updateUser = (id: number, user: UserRequest) => api.put<User>(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
