// app/dreamentry/_layout.tsx
import { Stack } from "expo-router";

export default function DreamEntryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Detailed dream entry",
        headerBackTitle: "",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#f6f7fb" },
        headerTitleStyle: { fontSize: 18, fontWeight: "700" },
      }}
    />
  );
}
