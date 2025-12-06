// src/components/ui/Button.tsx
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
      const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-500 active:bg-primary-600";
      case "secondary":
        return "bg-slate-500 active:bg-slate-600";
      case "outline":
        return "bg-transparent border-2 border-primary-500 active:bg-primary-50";
      case "danger":
        return "bg-danger-500 active:bg-danger-600";
      default:
        return "bg-primary-500 active:bg-primary-600";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "outline":
        return "text-primary-500";
      default:
        return "text-white";
    }
  };  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        py-3 px-6 rounded-xl items-center justify-center
        ${getVariantStyles()}
        ${disabled ? "opacity-50" : ""}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#059669" : "#fff"} />
      ) : (
        <Text className={`text-base font-semibold ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
