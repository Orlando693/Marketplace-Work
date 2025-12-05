// app/form.tsx
import FormScreen from "../src/screens/FormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function FormRoute() {
  return (
    <ProtectedRoute>
      <FormScreen />
    </ProtectedRoute>
  );
}
