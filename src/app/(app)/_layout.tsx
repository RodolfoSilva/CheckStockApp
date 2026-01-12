import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ animation: "none" }}>
      <Stack.Screen name="location" options={{ title: "Local" }} />
      <Stack.Screen name="item" options={{ title: "Item" }} />
      <Stack.Screen
        name="conferences/new"
        options={{ title: "Nova Conferência" }}
      />
      <Stack.Screen
        name="conferences/[id]/picking"
        options={{ title: "Picking" }}
      />
    </Stack>
  );
}
