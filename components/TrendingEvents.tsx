import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryGradient, getCategoryIcon } from "@/lib/categories";
import { formatEventDate, formatTime } from "@/lib/utils";
import type { Event } from "@/types";

interface TrendingEventsProps {
  events: Event[];
}

export function TrendingEvents({ events }: TrendingEventsProps) {
  const router = useRouter();

  const top3 = [...events]
    .sort((a, b) => b.going_count - a.going_count)
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <View className="mb-3">
      <View className="flex-row items-center gap-1.5 px-4 mb-2">
        <Ionicons name="flame" size={16} color="#FF6B00" />
        <Text className="text-sm font-bold text-text-primary">Trending</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
      >
        {top3.map((event) => {
          const [colorStart] = getCategoryGradient(event.category);
          return (
            <TouchableOpacity
              key={event.id}
              onPress={() => router.push(`/event/${event.id}`)}
              activeOpacity={0.8}
              className="rounded-2xl overflow-hidden"
              style={{ width: 280 }}
            >
              <View
                className="p-4 justify-end"
                style={{ height: 140, backgroundColor: colorStart }}
              >
                <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} />

                {/* Going badge */}
                <View className="absolute top-3 right-3 flex-row items-center gap-1 rounded-full px-2.5 py-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <Ionicons name="people" size={12} color="#00D2FF" />
                  <Text className="text-xs font-bold text-white">{event.going_count}</Text>
                </View>

                {/* Category icon */}
                <View className="absolute top-3 left-3">
                  <Ionicons name={getCategoryIcon(event.category) as any} size={20} color="rgba(255,255,255,0.6)" />
                </View>

                {/* Content at bottom */}
                <Text className="text-lg font-black text-white mb-1" numberOfLines={1}>
                  {event.title}
                </Text>
                <Text className="text-xs text-white/70" numberOfLines={1}>
                  {event.venue?.name} · {formatEventDate(event.event_date)} · {formatTime(event.time_start)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
