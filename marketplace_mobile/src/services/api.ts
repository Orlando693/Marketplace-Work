// src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

// Detectar entorno y configurar URL base
const getBaseURL = () => {
  if (Platform.OS === "web") {
    // En web, usar localhost
    return "http://localhost:8080/api";
  } else if (Platform.OS === "android") {
    // En Android emulador
    return "http://10.0.2.2:8080/api";
  } else if (Platform.OS === "ios") {
    // En iOS emulador
    return "http://localhost:8080/api";
  }
  // Celular físico: cambiar por IP de tu PC
  return "http://192.168.1.100:8080/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
