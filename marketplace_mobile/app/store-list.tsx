// app/store-list.tsx
import StoreListScreen from "../src/screens/StoreListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function StoreListRoute() {
  return (
    <ProtectedRoute>
      <StoreListScreen />
    </ProtectedRoute>
  );
}
