// app/product-form.tsx
import ProductFormScreen from "../src/screens/ProductFormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function ProductFormRoute() {
  return (
    <ProtectedRoute>
      <ProductFormScreen />
    </ProtectedRoute>
  );
}
