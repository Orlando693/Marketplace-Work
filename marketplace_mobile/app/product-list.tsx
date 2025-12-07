// app/product-list.tsx
import ProductListScreen from "../src/screens/ProductListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function ProductListRoute() {
  return (
    <ProtectedRoute>
      <ProductListScreen />
    </ProtectedRoute>
  );
}
