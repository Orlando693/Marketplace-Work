// app/home.tsx
import HomeScreen from "../src/screens/HomeScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function HomeRoute() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
