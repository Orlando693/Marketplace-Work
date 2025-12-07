// app/order-item-form.tsx
import OrderItemFormScreen from "../src/screens/OrderItemFormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function OrderItemFormRoute() {
  return (
    <ProtectedRoute>
      <OrderItemFormScreen />
    </ProtectedRoute>
  );
}
