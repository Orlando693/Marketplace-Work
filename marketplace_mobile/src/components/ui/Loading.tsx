// src/components/ui/Loading.tsx
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text, fullScreen = true }: LoadingProps) {
  return (
    <View
      className={`
        ${fullScreen ? "flex-1" : "py-10"}
        justify-center items-center bg-white
      `}
    >
      <ActivityIndicator size="large" color="#3b82f6" />
      {text && (
        <Text className="text-slate-600 mt-4 text-base">{text}</Text>
      )}
    </View>
  );
}
