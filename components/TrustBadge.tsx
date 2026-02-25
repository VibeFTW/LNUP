import { View, Text } from "react-native";
import type { EventSourceType } from "@/types";

const BADGE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  api_ticketmaster: { label: "✦ Ticketmaster", color: "#009CDE", bgColor: "rgba(0,156,222,0.15)" },
  ai_discovered: { label: "✦ KI-erkannt", color: "#8B7CF7", bgColor: "rgba(139,124,247,0.15)" },
  ai_scraped: { label: "✦ KI-erkannt", color: "#8B7CF7", bgColor: "rgba(139,124,247,0.15)" },
  platform: { label: "✦ LNUP", color: "#6C5CE7", bgColor: "rgba(108,92,231,0.15)" },
  verified_organizer: { label: "✓ Veranstalter", color: "#00E676", bgColor: "rgba(0,230,118,0.15)" },
  verified_user: { label: "✓ Verifiziert", color: "#00D2FF", bgColor: "rgba(0,210,255,0.15)" },
  community: { label: "○ Community", color: "#6B6B80", bgColor: "rgba(107,107,128,0.15)" },
};

interface TrustBadgeProps {
  sourceType: EventSourceType;
}

const DEFAULT_BADGE = { label: "○ Unbekannt", color: "#6B6B80", bgColor: "rgba(107,107,128,0.15)" };

export function TrustBadge({ sourceType }: TrustBadgeProps) {
  const config = BADGE_CONFIG[sourceType] ?? DEFAULT_BADGE;

  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: config.bgColor }}
    >
      <Text className="text-xs font-semibold" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
}
