// src/store/useAuthStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  id: number;
  email: string;
  // agrega aquí los campos que realmente devuelve tu backend
};

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // Guarda usuario en memoria y (opcional) en AsyncStorage
  setUser: async (user) => {
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("user");
    }
    set({ user });
  },

  // Guarda token en memoria y en AsyncStorage
  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem("token", token);
    } else {
      await AsyncStorage.removeItem("token");
    }
    set({ token });
  },

  // Cargar sesión al iniciar la app (token + user)
  loadSession: async () => {
    const [token, userRaw] = await Promise.all([
      AsyncStorage.getItem("token"),
      AsyncStorage.getItem("user"),
    ]);

    set({
      token: token ?? null,
      user: userRaw ? JSON.parse(userRaw) : null,
    });
  },

  // Logout completo
  logout: async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    set({ user: null, token: null });
  },
}));
