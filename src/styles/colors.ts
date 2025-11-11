export const lightColors = {
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    muted: "#6b7280",
    primary: "#2563eb",
    primaryText: "#ffffff",
    border: "#e5e7eb",
    danger: "#dc2626",
    success: "#16a34a",
};
  
export const darkColors = {
    background: "#0b0b10",
    surface: "#16161d",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    primary: "#4f46e5",
    primaryText: "#ffffff",
    border: "#27272a",
    danger: "#ef4444",
    success: "#22c55e",
};
  
//theme switching
export const colorThemes = {
    light: lightColors,
    dark: darkColors,
};
  
 
export type ColorTheme = typeof lightColors;