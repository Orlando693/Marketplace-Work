import React from "react";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import OrderFormScreen from "../src/screens/OrderFormScreen";

export default function OrderFormPage() {
  return (
    <ProtectedRoute>
      <OrderFormScreen />
    </ProtectedRoute>
  );
}
