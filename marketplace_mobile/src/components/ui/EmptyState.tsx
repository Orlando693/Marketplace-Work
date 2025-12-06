// src/components/ui/EmptyState.tsx
import { View, Text } from "react-native";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "📦",
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-8 bg-slate-50">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
        {title}
      </Text>
      <Text className="text-base text-slate-600 text-center mb-6">
        {description}
      </Text>

      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
