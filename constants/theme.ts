import { Platform } from "react-native";

//FONTS
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",       // System UI font
    serif: "ui-serif",       // Serif font
    rounded: "ui-rounded",   // Rounded font
    mono: "ui-monospace",    // Monospace font
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

//COLORS
export const COLORS = {
  primary: "#e3720b",
  gold: "#ffd700",

  light: {
    background: "#f8f8f8",
    card: "#fff",
    cardBorder: "#f0f0f0",
    text: "#000",
    textSecondary: "#333",
    textTertiary: "#666",
    placeholder: "#999",
  },

  dark: {
    background: "#000",
    card: "#1a1a1a",
    cardBorder: "#2a2a2a",
    text: "#fff",
    textSecondary: "#ccc",
    textTertiary: "#999",
    placeholder: "#666",
  },
};

//SIZES
export const SIZES = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 15,
    xlarge: 25,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  image: {
    card: {
      width: 100,
      height: 140,
    },
    banner: {
      height: 200,
    },
  },
};