// src/components/ui/Input.tsx
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  ...textInputProps
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-700 font-medium mb-2 text-base">
          {label}
        </Text>
      )}

      <TextInput
        className={`
          w-full rounded-xl px-4 py-3 text-base
          bg-slate-50 border
          ${error ? "border-red-500" : "border-slate-300"}
          text-slate-900
        `}
        placeholderTextColor="#94a3b8"
        {...textInputProps}
      />

      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}

      {helperText && !error && (
        <Text className="text-slate-500 text-sm mt-1 ml-1">{helperText}</Text>
      )}
    </View>
  );
}
