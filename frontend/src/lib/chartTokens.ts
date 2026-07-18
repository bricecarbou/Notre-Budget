import { useThemeStore } from "@/store/themeStore";

export const CHART_TOKENS_DARK = {
  surface: "#0f172a",
  textPrimary: "#ffffff",
  textSecondary: "#c3c2b7",
  muted: "#898781",
  gridline: "#2c2c2a",
  baseline: "#383835",
  seriesPrimary: "#3987e5",
};

export const CHART_TOKENS_LIGHT = {
  surface: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  muted: "#94a3b8",
  gridline: "#e2e8f0",
  baseline: "#cbd5e1",
  seriesPrimary: "#2a78d6",
};

export function useChartTokens() {
  const theme = useThemeStore((s) => s.theme);
  return theme === "dark" ? CHART_TOKENS_DARK : CHART_TOKENS_LIGHT;
}
