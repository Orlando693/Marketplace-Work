// app/order-item-list.tsx
import OrderItemListScreen from "../src/screens/OrderItemListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function OrderItemListRoute() {
  return (
    <ProtectedRoute>
      <OrderItemListScreen />
    </ProtectedRoute>
  );
}
