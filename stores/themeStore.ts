import { create } from "zustand";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeColors {
  background: string;
  card: string;
  cardHover: string;
  border: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

const DARK_COLORS: ThemeColors = {
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
};

const LIGHT_COLORS: ThemeColors = {
  background: "#F5F5FA",
  card: "#FFFFFF",
  cardHover: "#F0F0F5",
  border: "#E8E8F0",
  primary: "#6C5CE7",
  primaryLight: "#8B7CF7",
  secondary: "#00B4D8",
  accent: "#FF6B9D",
  success: "#00C853",
  warning: "#FF9800",
  danger: "#EF5350",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B6B80",
  textMuted: "#A0A0B8",
};

interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  initialize: () => Promise<void>;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return Appearance.getColorScheme() === "dark" ? "dark" : "light";
  }
  return mode;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  resolved: "light",
  colors: LIGHT_COLORS,
  isDark: false,

  setMode: (mode) => {
    const resolved = resolveTheme(mode);
    set({
      mode,
      resolved,
      colors: resolved === "dark" ? DARK_COLORS : LIGHT_COLORS,
      isDark: resolved === "dark",
    });
    AsyncStorage.setItem("@lnup_theme", mode);
  },

  initialize: async () => {
    const saved = (await AsyncStorage.getItem("@lnup_theme")) as ThemeMode | null;
    const mode = saved ?? "light";
    const resolved = resolveTheme(mode);
    set({
      mode,
      resolved,
      colors: resolved === "dark" ? DARK_COLORS : LIGHT_COLORS,
      isDark: resolved === "dark",
    });

    Appearance.addChangeListener(({ colorScheme }) => {
      if (get().mode === "system") {
        const r = colorScheme === "dark" ? "dark" : "light";
        set({
          resolved: r,
          colors: r === "dark" ? DARK_COLORS : LIGHT_COLORS,
          isDark: r === "dark",
        });
      }
    });
  },
}));
