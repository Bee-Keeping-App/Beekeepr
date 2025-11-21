// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  Switch,
  View,
  Appearance,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { colorThemes, ColorTheme } from "../styles/colors";

// Types
type ThemeName = keyof typeof colorThemes;

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

type ThemeSwitchProps = {
  label?: string;
  invertLabel?: boolean;
  style?: ViewStyle;
};

type ModalSize = "small" | "medium" | "large" | "full";

type ThemedModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  size?: ModalSize;
  dismissOnBackdropPress?: boolean;
  contentStyle?: ViewStyle;
};

type ThemeContextType = {
  theme: ThemeName;
  colors: ColorTheme;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  components: {
    Button: React.FC<ButtonProps>;
    ThemeSwitch: React.FC<ThemeSwitchProps>;
    Modal: React.FC<ThemedModalProps>;
  };
  createButton: (
    title: string,
    onPress?: () => void,
    style?: ViewStyle,
    textStyle?: TextStyle
  ) => JSX.Element;
  createThemeSwitch: (props?: Partial<ThemeSwitchProps>) => JSX.Element;
  createModal: (props: ThemedModalProps) => JSX.Element;
};

// Styles

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
  switchRow: (c: ColorTheme): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }),
  switchLabel: (c: ColorTheme): TextStyle => ({
    color: c.text,
    fontWeight: "600",
  }),

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  } as ViewStyle,

  modalContent: (c: ColorTheme, size: ModalSize): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 5,
      maxWidth: "100%",
    };

    switch (size) {
      case "small":
        return { ...base, width: "70%", maxHeight: "40%" };
      case "medium":
        return { ...base, width: "85%", maxHeight: "60%" };
      case "large":
        return { ...base, width: "95%", maxHeight: "80%" };
      case "full":
        return { ...base, width: "100%", height: "100%", borderRadius: 0 };
      default:
        return base;
    }
  },

  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  } as ViewStyle,

  modalTitle: (c: ColorTheme): TextStyle => ({
    color: c.text,
    fontSize: 18,
    fontWeight: "700",
  }),

  modalCloseText: (c: ColorTheme): TextStyle => ({
    color: c.muted,
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 4,
  }),
};

// Context

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};

// Components

const ThemedButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button(colors), style]}>
      <Text style={[styles.buttonText(colors), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  label,
  invertLabel,
  style,
}) => {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const text =
    label ??
    (invertLabel
      ? isDark
        ? "Light mode"
        : "Dark mode"
      : isDark
      ? "Dark mode"
      : "Light mode");

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

//Modal objects
const ThemedModal: React.FC<ThemedModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = "medium",
  dismissOnBackdropPress = true,
  contentStyle,
}) => {
  const { colors } = useTheme();

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent(colors, size), contentStyle]}>
              {title && (
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle(colors)}>{title}</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.modalCloseText(colors)}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Provider

export const ThemeProvider: React.FC<{
  initialTheme?: ThemeName;
  respectSystem?: boolean;
  children: ReactNode;
}> = ({ initialTheme, respectSystem = true, children }) => {
  const system = Appearance.getColorScheme() === "dark" ? "dark" : "light";
  const [theme, setTheme] = useState<ThemeName>(
    initialTheme ?? (respectSystem ? system : "light")
  );

  useEffect(() => {
    if (!respectSystem) return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [respectSystem]);

  const colors = useMemo(() => colorThemes[theme], [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      colors,
      setTheme,
      toggleTheme,
      components: {
        Button: ThemedButton,
        ThemeSwitch,
        Modal: ThemedModal,
      },
      //helper create functions
      createButton: (title, onPress, style, textStyle) => (
        <ThemedButton
          title={title}
          onPress={onPress}
          style={style}
          textStyle={textStyle}
        />
      ),
      createThemeSwitch: (props) => <ThemeSwitch {...props} />,

      createModal: (props) => <ThemedModal {...props} />,
    }),
    [theme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
