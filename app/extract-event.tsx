import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { supabase } from "@/lib/supabase";
import { extractEventsFromUrl, type ExtractedEvent } from "@/lib/aiScraper";
import { COLORS } from "@/lib/constants";

export default function ExtractEventScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([]);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const handleExtract = async () => {
    Keyboard.dismiss();
    if (!url.trim()) {
      Alert.alert("Fehler", "Bitte gib eine URL ein.");
      return;
    }

    setIsExtracting(true);
    setExtractedEvents([]);

    try {
      const events = await extractEventsFromUrl(url.trim());
      if (events.length === 0) {
        Alert.alert("Keine Events gefunden", "Auf dieser Seite konnten keine Events erkannt werden.");
      }
      setExtractedEvents(events);
    } catch (error: any) {
      Alert.alert("Fehler", error?.message ?? "Event-Erkennung fehlgeschlagen.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (event: ExtractedEvent, index: number) => {
    if (!user) {
      Alert.alert("Nicht angemeldet", "Bitte melde dich an.");
      return;
    }

    setSubmittingId(index);
    try {
      let venueId: string | null = null;

      const { data: existingVenue } = await supabase
        .from("venues")
        .select("id")
        .ilike("name", `%${event.venue_name}%`)
        .limit(1)
        .maybeSingle();

      if (existingVenue) {
        venueId = existingVenue.id;
      } else {
        const { data: newVenue, error: venueError } = await supabase
          .from("venues")
          .insert({
            name: event.venue_name,
            address: event.venue_address,
            city: event.city,
            lat: 0,
            lng: 0,
          })
          .select("id")
          .single();

        if (venueError) throw venueError;
        venueId = newVenue.id;
      }

      const { error } = await supabase.from("events").insert({
        title: event.title,
        description: event.description,
        venue_id: venueId,
        event_date: event.date,
        time_start: event.time_start,
        time_end: event.time_end,
        category: event.category,
        price_info: event.price_info || null,
        source_type: "ai_scraped",
        source_url: url.trim(),
        created_by: user.id,
        status: "pending_review",
        ai_confidence: event.confidence,
      });

      if (error) throw error;

      useToastStore.getState().showToast("Zur Prüfung eingereicht!", "success");
      setExtractedEvents((prev) => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      Alert.alert("Fehler", error?.message ?? "Event konnte nicht eingereicht werden.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center px-4 py-3 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text-primary">Event aus URL</Text>
          <Text className="text-xs text-text-muted">KI erkennt Events automatisch</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 gap-4 pb-8">
          <View>
            <Text className="text-sm font-medium text-text-secondary mb-1.5">
              Webseite mit Event-Infos
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://..."
                placeholderTextColor={COLORS.textMuted}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-base"
              />
              <TouchableOpacity
                onPress={handleExtract}
                disabled={isExtracting || !url.trim()}
                className={`rounded-xl px-4 items-center justify-center ${
                  isExtracting || !url.trim() ? "bg-primary/30" : "bg-primary"
                }`}
              >
                {isExtracting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {isExtracting && (
            <View className="items-center py-12">
              <ActivityIndicator color="#6C5CE7" size="large" />
              <Text className="text-sm text-text-muted mt-4">KI analysiert die Seite...</Text>
            </View>
          )}

          {extractedEvents.length > 0 && (
            <View>
              <Text className="text-sm font-semibold text-text-primary mb-3">
                {extractedEvents.length} Event{extractedEvents.length !== 1 ? "s" : ""} erkannt
              </Text>
              <View className="gap-3">
                {extractedEvents.map((event, index) => (
                  <View
                    key={index}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-base font-bold text-text-primary flex-1" numberOfLines={2}>
                        {event.title}
                      </Text>
                      <View className="bg-primary/15 rounded-full px-2 py-0.5 ml-2">
                        <Text className="text-xs text-primary font-medium">
                          {Math.round(event.confidence * 100)}%
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm text-text-secondary mb-3" numberOfLines={3}>
                      {event.description}
                    </Text>

                    <View className="gap-1.5 mb-4">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                        <Text className="text-xs text-text-secondary">
                          {event.date} · {event.time_start}{event.time_end ? ` – ${event.time_end}` : ""}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                        <Text className="text-xs text-text-secondary">
                          {event.venue_name}{event.city ? `, ${event.city}` : ""}
                        </Text>
                      </View>
                      {event.price_info && (
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="pricetag-outline" size={14} color={COLORS.textMuted} />
                          <Text className="text-xs text-text-secondary">{event.price_info}</Text>
                        </View>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => handleSubmit(event, index)}
                      disabled={submittingId === index}
                      className={`rounded-xl py-3 items-center ${
                        submittingId === index ? "bg-primary/50" : "bg-primary"
                      }`}
                    >
                      <Text className="text-white font-bold text-sm">
                        {submittingId === index ? "Wird eingereicht..." : "Zur Prüfung einreichen"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!isExtracting && extractedEvents.length === 0 && (
            <View className="items-center py-12 px-4">
              <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Ionicons name="sparkles" size={28} color="#6C5CE7" />
              </View>
              <Text className="text-sm text-text-secondary text-center">
                Füge eine URL ein und die KI erkennt automatisch Events auf der Seite.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
