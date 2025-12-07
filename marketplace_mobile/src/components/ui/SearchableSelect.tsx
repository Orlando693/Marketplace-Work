// src/components/ui/SearchableSelect.tsx
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchableSelectProps {
  label: string;
  value: string | number;
  onSelect: (value: string | number, label: string) => void;
  options: Array<{ id: number; label: string; subtitle?: string }>;
  placeholder?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function SearchableSelect({
  label,
  value,
  onSelect,
  options,
  placeholder = "Select an option",
  error,
  icon = "search-outline",
}: SearchableSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((opt) => opt.id === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option: { id: number; label: string }) => {
    onSelect(option.id, option.label);
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={18} color="#64748b" />
        <Text className="text-slate-700 font-semibold ml-2">{label}</Text>
      </View>

      <Pressable
        onPress={() => setModalVisible(true)}
        className={`flex-row items-center justify-between bg-white border rounded-xl px-4 py-3.5 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      >
        <Text
          className={`flex-1 ${
            selectedOption ? "text-slate-800" : "text-slate-400"
          }`}
        >
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#64748b" />
      </Pressable>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-200">
              <Text className="text-lg font-bold text-slate-800">{label}</Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            {/* Search Input */}
            <View className="px-6 py-4 border-b border-slate-100">
              <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3">
                <Ionicons name="search" size={20} color="#64748b" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 ml-2 text-slate-800"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#94a3b8" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View className="items-center justify-center py-10">
                  <Ionicons name="search-outline" size={48} color="#cbd5e1" />
                  <Text className="text-slate-400 mt-4">No results found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className={`mb-2 p-4 rounded-xl border ${
                    value === item.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                        value === item.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300"
                      }`}
                    >
                      {value === item.id && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-semibold ${
                          value === item.id ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {item.label}
                      </Text>
                      {item.subtitle && (
                        <Text className="text-slate-500 text-sm mt-0.5">
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
