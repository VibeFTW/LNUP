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
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/stores/toastStore";
import { COLORS } from "@/lib/constants";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const handleReset = async () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      showToast("Bitte gib deine E-Mail-Adresse ein.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setSent(true);
    } catch {
      showToast("Passwort-Reset fehlgeschlagen. Bitte überprüfe deine E-Mail-Adresse.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center px-8"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-20 h-20 rounded-full bg-success/15 items-center justify-center mb-6">
          <Text className="text-4xl">✉️</Text>
        </View>
        <Text className="text-xl font-bold text-text-primary text-center mb-3">
          E-Mail gesendet!
        </Text>
        <Text className="text-sm text-text-secondary text-center mb-8">
          Wir haben dir einen Link zum Zurücksetzen deines Passworts an{" "}
          <Text className="text-primary font-medium">{email}</Text> gesendet.
          Prüfe deinen Posteingang.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary rounded-xl py-3.5 px-8"
        >
          <Text className="text-white font-bold text-base">Zurück zum Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <Text className="text-4xl font-black text-primary mb-2">LNUP</Text>
          <Text className="text-sm text-text-secondary">Passwort zurücksetzen</Text>
        </View>

        <Text className="text-sm text-text-secondary mb-6 text-center">
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
        </Text>

        <View className="mb-6">
          <Text className="text-sm font-medium text-text-secondary mb-1.5">E-Mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="deine@email.de"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            className="bg-card border border-border rounded-xl px-4 py-3.5 text-text-primary text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleReset}
          disabled={isLoading}
          className={`rounded-xl py-4 items-center ${isLoading ? "bg-primary/50" : "bg-primary"}`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Wird gesendet..." : "Link senden"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="mt-4 items-center">
          <Text className="text-sm text-text-secondary">
            Zurück zum <Text className="text-primary font-medium">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
