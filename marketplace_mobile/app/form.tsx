import { View, Text } from "react-native";
import "../global.css";

export default function FormScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Formulario</Text>
      <Text>Aquí luego pondrás el formulario para crear/editar.</Text>
    </View>
  );
}
