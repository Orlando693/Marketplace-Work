// app/review-form.tsx
import ReviewFormScreen from "../src/screens/ReviewFormScreen";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

export default function ReviewFormRoute() {
  return (
    <ProtectedRoute>
      <ReviewFormScreen />
    </ProtectedRoute>
  );
}
