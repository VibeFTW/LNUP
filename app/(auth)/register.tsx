import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { COLORS } from "@/lib/constants";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useToastStore((s) => s.showToast);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!username || !email || !password) {
      showToast("Bitte alle Felder ausfüllen.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwörter stimmen nicht überein.", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Passwort muss mindestens 6 Zeichen lang sein.", "error");
      return;
    }
    try {
      await register(email, password, username);
      router.replace("/(tabs)");
    } catch {
      showToast("Registrierung fehlgeschlagen.", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-black text-primary mb-2">LNUP</Text>
          <Text className="text-sm text-text-secondary">Konto erstellen</Text>
        </View>

        {/* Form */}
        <View className="gap-4 mb-6">
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Benutzername
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="dein_name"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
            />
          </View>

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
              placeholder="Mind. 6 Zeichen"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Passwort bestätigen
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Passwort wiederholen"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading}
          className={`rounded-xl py-4 items-center ${
            isLoading ? "bg-primary/50" : "bg-primary"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Wird erstellt..." : "Registrieren"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-text-secondary">
            Schon ein Konto?{" "}
            <Text className="text-primary font-medium">Anmelden</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
