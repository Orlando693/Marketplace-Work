// app/review-list.tsx
import ReviewListScreen from "../src/screens/ReviewListScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function ReviewListRoute() {
  return (
    <ProtectedRoute>
      <ReviewListScreen />
    </ProtectedRoute>
  );
}
