// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// ⚠️ Ajusta esta URL a tu caso:
// - Emulador Android Studio  → http://10.0.2.2:8080/api
// - Celular físico en la misma WiFi → http://IP_DE_TU_PC:8080/api
export const api = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
});

// Interceptor para agregar Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
