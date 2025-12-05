// app/list.tsx
import ListScreen from "../src/screens/ListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function ListRoute() {
  return (
    <ProtectedRoute>
      <ListScreen />
    </ProtectedRoute>
  );
}
