// src/components/ui/Card.tsx
import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}

export default function Card({ children, onPress, className = "" }: CardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className={`
        bg-white rounded-2xl p-5 mb-4
        shadow-lg shadow-slate-300
        border border-slate-200
        ${onPress ? "active:opacity-80" : ""}
        ${className}
      `}
    >
      {children}
    </Wrapper>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <View className="mb-3">
      <Text className="text-xl font-bold text-slate-800">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-slate-500 mt-1">{subtitle}</Text>
      )}
    </View>
  );
}

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <View className="py-2">{children}</View>;
}

interface CardFooterProps {
  children: ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <View className="flex-row justify-end gap-2 mt-4 pt-4 border-t border-slate-200">
      {children}
    </View>
  );
}
