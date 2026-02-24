import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Toast } from "@/components/Toast";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const initializeTheme = useThemeStore((s) => s.initialize);
  const isDark = useThemeStore((s) => s.isDark);
  const colors = useThemeStore((s) => s.colors);

  useEffect(() => {
    async function prepare() {
      const [onboarded] = await Promise.all([
        AsyncStorage.getItem("@lnup_onboarded"),
        initializeAuth(),
        initializeTheme(),
      ]);
      setNeedsOnboarding(onboarded !== "true");
      setIsReady(true);
      SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Toast />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
        initialRouteName={needsOnboarding ? "onboarding" : "(tabs)"}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="event/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="leaderboard"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="user/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="privacy"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="terms"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="imprint"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="profile-edit"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="notification-settings"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="join-event"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="invite/[code]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="extract-event"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="admin-review"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </View>
  );
}
