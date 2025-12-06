// src/components/ui/Select.tsx
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface SelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
}

export default function Select({
  label,
  value,
  onValueChange,
  options,
  error,
  placeholder = "Select an option",
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className="mb-4">
      <Text className="text-slate-700 font-semibold mb-2">{label}</Text>
      
      {/* Select Button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="rounded-lg bg-slate-50 border px-4 py-3 flex-row justify-between items-center"
        style={{ borderColor: error ? "#ef4444" : "#cbd5e1" }}
      >
        <Text
          style={{ color: selectedOption?.value ? "#0f172a" : "#94a3b8" }}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#64748b" />
      </Pressable>

      {error && <Text className="text-danger-600 text-sm mt-1">{error}</Text>}

      {/* Modal with options */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setModalVisible(false)}
        >
          <Pressable 
            className="bg-white rounded-2xl w-4/5 max-h-96"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-slate-200">
              <Text className="text-lg font-bold text-slate-800">{label}</Text>
            </View>
            
            <ScrollView className="max-h-80">
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}
                  className="p-4 border-b border-slate-100"
                  style={{ backgroundColor: option.value === value ? "#eff6ff" : "transparent" }}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-base"
                      style={{
                        color: option.value === value ? "#3b82f6" : "#334155",
                        fontWeight: option.value === value ? "600" : "400",
                      }}
                    >
                      {option.label}
                    </Text>
                    {option.value === value && (
                      <Ionicons name="checkmark" size={24} color="#3b82f6" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="p-4 border-t border-slate-200"
            >
              <Text className="text-center text-primary-600 font-semibold">
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
