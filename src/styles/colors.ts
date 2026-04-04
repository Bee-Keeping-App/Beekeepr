export const lightColors = {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#6B7280',
    primary: '#F5A623',
    primaryText: '#1A1A1A',
    border: '#E5E7EB',
    danger: '#EF4444',
    success: '#22C55E',
};

export const darkColors = {
    background: '#0b0b10',
    surface: '#16161d',
    text: '#f4f4f5',
    muted: '#a1a1aa',
    primary: '#F5A623',
    primaryText: '#1A1A1A',
    border: '#27272a',
    danger: '#ef4444',
    success: '#22c55e',
};

export const colorThemes = {
    light: lightColors,
    dark: darkColors,
};

export type ColorTheme = typeof lightColors;
