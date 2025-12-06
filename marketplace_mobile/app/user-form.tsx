// app/user-form.tsx
import UserFormScreen from "../src/screens/UserFormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function UserFormRoute() {
  return (
    <ProtectedRoute>
      <UserFormScreen />
    </ProtectedRoute>
  );
}
