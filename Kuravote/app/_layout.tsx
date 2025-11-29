import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="appmenu" options={{
      animation: 'slide_from_bottom',
      animationDuration: 1200,
    }} />
    </Stack>
  );
}
