import { View, Text } from "react-native";

export default function ListScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Listado</Text>
      <Text>Luego aquí listamos datos del backend.</Text>
    </View>
  );
}
