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
    // En Android - usar IP de tu PC en la red local
    return "http://192.168.0.15:8080/api";
  } else if (Platform.OS === "ios") {
    // En iOS emulador
    return "http://localhost:8080/api";
  }
  // Celular físico: cambiar por IP de tu PC
  return "http://192.168.0.15:8080/api";
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
  console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  console.log(`🔑 Token from store:`, token ? `"${token.substring(0, 20)}..."` : 'null/undefined');
  
  // Validar que el token tenga el formato correcto de JWT (debe tener 2 puntos)
  const isValidJWT = token && typeof token === 'string' && token.trim().length > 0 && token.split('.').length === 3;
  
  if (isValidJWT) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Valid JWT token added to request");
  } else {
    console.log("⚠️ Invalid or missing token - removing Authorization header");
    // Asegurarse de que no haya un header Authorization vacío o inválido
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
  }
  
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    return Promise.reject(error);
  }
);
