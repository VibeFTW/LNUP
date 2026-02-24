import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { COLORS } from "@/lib/constants";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useToastStore((s) => s.showToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      showToast("Bitte E-Mail und Passwort eingeben.", "error");
      return;
    }
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      showToast("Anmeldung fehlgeschlagen. Bitte prüfe deine Zugangsdaten.", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo */}
        <View className="items-center mb-12">
          <Text className="text-5xl font-black text-primary mb-2">LNUP</Text>
          <Text className="text-sm text-text-secondary">
            Local Nights, Unique Places
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4 mb-6">
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              E-Mail
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="deine@email.de"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Passwort
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="items-end mb-6"
        >
          <Text className="text-sm text-primary font-medium">Passwort vergessen?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`rounded-xl py-4 items-center ${
            isLoading ? "bg-primary/50" : "bg-primary"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-text-secondary">
            Kein Konto?{" "}
            <Text className="text-primary font-medium">Registrieren</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
