// ThemeContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode, JSX } from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle, Switch, View, Appearance } from "react-native";
import { colorThemes, ColorTheme } from "../styles/colors";

// Type declerations
type ThemeName = keyof typeof colorThemes;

//button dec
interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface ThemeContextType {
  theme: ThemeName;
  colors: ColorTheme;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  components: {
    //add more components here
    Button: React.FC<ButtonProps>;
    ThemeSwitch: React.FC<ThemeSwitchProps>;
  };
  //add any more helper funcs
  createButton: (title: string, onPress?: () => void, style?: ViewStyle, textStyle?: TextStyle) => JSX.Element;
  createThemeSwitch: (props?: Partial<ThemeSwitchProps>) => JSX.Element;
}

// ThemeProvider dec
interface ThemeProviderProps {
  initialTheme?: ThemeName;
  respectSystem?: boolean;
  children: ReactNode;
}

// import color/styles from color.ts
const styles = {
  button: (c: ColorTheme): ViewStyle => ({
    backgroundColor: c.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  }),
  buttonText: (c: ColorTheme): TextStyle => ({
    color: c.primaryText,
    fontWeight: "700",
  }),
  switchRow: (_c: ColorTheme): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }),
  switchLabel: (c: ColorTheme): TextStyle => ({
    color: c.text,
    fontWeight: "600",
  }),
};

// declaration for context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
//func to use context
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};

//  Components  (literal objects used)

//button
const ThemedButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button(colors), style]}>
      <Text style={[styles.buttonText(colors), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

//helper obj for themeswitching logic
type ThemeSwitchProps = {
  label?: string;
  invertLabel?: boolean;
  style?: ViewStyle;
};

//style logic to check light/dark mode
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ label, invertLabel, style }) => {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const text = label ?? (invertLabel ? (isDark ? "Light mode" : "Dark mode") : (isDark ? "Dark mode" : "Light mode"));

  return (
    <View style={[styles.switchRow(colors), style]}>
      <Text style={styles.switchLabel(colors)}>{text}</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.border, true: colors.muted }}
        thumbColor={isDark ? colors.primary : colors.surface}
      />
    </View>
  );
};

//  Provider  (actual exported obj)
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ initialTheme, respectSystem = true, children }) => {
  const system = Appearance.getColorScheme() === "dark" ? "dark" : "light";
  const [theme, setTheme] = useState<ThemeName>(initialTheme ?? (respectSystem ? system : "light"));

  useEffect(() => {
    if (!respectSystem) return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [respectSystem]);

  const colors = useMemo(() => colorThemes[theme], [theme]);
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      colors,
      setTheme,
      toggleTheme,
      components: { Button: ThemedButton, ThemeSwitch },
      createButton: (title, onPress, style, textStyle) => <ThemedButton title={title} onPress={onPress} style={style} textStyle={textStyle} />,
      createThemeSwitch: props => <ThemeSwitch {...props} />,
    }),
    [theme, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


//ex of use 
//import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
//const { colors, theme, toggleTheme, createButton, createThemeSwitch } = useTheme();

//buttons to switch theme:

// {createButton(`Switch to ${theme === "light" ? "dark" : "light"} mode`, toggleTheme)}

//const { Button } = components;
//<Button title="Toggle Theme" onPress={toggleTheme} />;
