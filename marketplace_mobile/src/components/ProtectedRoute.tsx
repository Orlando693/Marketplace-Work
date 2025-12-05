// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const token = useAuthStore((s) => s.token);
  const loadSession = useAuthStore((s) => s.loadSession);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      // Intentar cargar sesión desde AsyncStorage
      await loadSession();

      // Si no hay token y no estamos ya en /login → enviar a login
      if (!useAuthStore.getState().token && pathname !== "/login") {
        router.replace("/login");
      }
    })();
  }, [pathname]);

  // Mientras no sabemos si hay token, muestra loader
  if (token === null && pathname !== "/login") {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
