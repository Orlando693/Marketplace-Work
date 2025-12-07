// app/store-form.tsx
import StoreFormScreen from "../src/screens/StoreFormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function StoreFormRoute() {
  return (
    <ProtectedRoute>
      <StoreFormScreen />
    </ProtectedRoute>
  );
}
