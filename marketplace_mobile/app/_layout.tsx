import { Stack } from "expo-router";
import "../global.css";


export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="list" />
      <Stack.Screen name="form" />
      <Stack.Screen name="user-list" />
      <Stack.Screen name="user-form" />
      <Stack.Screen name="order-list" />
      <Stack.Screen name="order-form" />
      <Stack.Screen name="order-item-list" />
      <Stack.Screen name="order-item-form" />
      <Stack.Screen name="review-list" />
      <Stack.Screen name="review-form" />
      <Stack.Screen name="store-list" />
      <Stack.Screen name="store-form" />
      <Stack.Screen name="product-list" />
      <Stack.Screen name="product-form" />
    </Stack>
  );
}
