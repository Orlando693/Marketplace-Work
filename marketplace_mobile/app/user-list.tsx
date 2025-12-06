// app/user-list.tsx
import UserListScreen from "../src/screens/UserListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function UserListRoute() {
  return (
    <ProtectedRoute>
      <UserListScreen />
    </ProtectedRoute>
  );
}
