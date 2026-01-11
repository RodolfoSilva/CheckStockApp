import { StyleSheet } from "react-native-unistyles";

export const lightTheme = {
  colors: {
    background: "#F5F7FA",
    card: "#FFFFFF",
    text: "#11181C",
    textSecondary: "#687076",
    textTertiary: "#9BA1A6",
    border: "#E1E4E8",
    icon: "#687076",
    searchBackground: "#F1F3F5",
    tagBackground: "#F1F3F5",
    tagText: "#11181C",
    iconBackground: "#F1F3F5",
    iconForeground: "#0a7ea4",
    pillBackground: "#E8E8E8",
    pillText: "#687076",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

export const darkTheme = {
  colors: {
    background: "#151718",
    card: "#1F2122",
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    textTertiary: "#687076",
    border: "#2A2D2E",
    icon: "#9BA1A6",
    searchBackground: "#2A2D2E",
    tagBackground: "#2A2D2E",
    tagText: "#ECEDEE",
    iconBackground: "#2A2D2E",
    iconForeground: "#0a7ea4",
    pillBackground: "#3A3A3A",
    pillText: "#9BA1A6",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: { initialTheme: "light" },
  themes: appThemes,
});
