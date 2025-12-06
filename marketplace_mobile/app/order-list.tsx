import React from "react";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import OrderListScreen from "../src/screens/OrderListScreen";

export default function OrderListPage() {
  return (
    <ProtectedRoute>
      <OrderListScreen />
    </ProtectedRoute>
  );
}
