import { store } from "@/redux/store";
import { Stack } from "expo-router/stack";
import { Provider } from "react-redux";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="todoScreen" />
        <Stack.Screen name="timelineScreen" />
        <Stack.Screen name="budgetScreen" />
        <Stack.Screen name="guestsScreen" />
        <Stack.Screen name="welcomeScreen" />
        <Stack.Screen name="loginScreen" />
        <Stack.Screen name="registerScreen" />
        <Stack.Screen name="onboardingScreen" />
      </Stack>
    </Provider>
  );
}
