export const COLORS = {
  background: "#0A0A0F",
  card: "#1A1A2E",
  cardHover: "#252540",
  border: "#2A2A3E",
  primary: "#6C5CE7",
  primaryLight: "#8B7CF7",
  secondary: "#00D2FF",
  accent: "#FF6B9D",
  success: "#00E676",
  warning: "#FFC107",
  danger: "#FF5252",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0B8",
  textMuted: "#6B6B80",
} as const;

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
export const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? "";
export const EVENTBRITE_API_KEY = process.env.EXPO_PUBLIC_EVENTBRITE_API_KEY ?? "";
export const TICKETMASTER_API_KEY = process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY ?? "";

export const REGION_CENTER = {
  latitude: 48.8317,
  longitude: 12.9589,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export const INITIAL_CITIES = [
  "Deggendorf",
  "Passau",
  "Straubing",
  "Regensburg",
] as const;
