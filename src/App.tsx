// App.tsx
import { Assets as NavigationAssets } from "@react-navigation/elements";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { Asset } from "expo-asset";
import { createURL } from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useColorScheme } from "react-native";

import AccountProvider from "./Contexts/AuthContext";
import { RootNavigator } from "./navigation/RootNavigator";
import { ThemeProvider } from "./Contexts/ThemeContext";
import { HiveProvider } from "./Contexts/HiveContext";

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadAssets() {
      try {
        await Asset.loadAsync([
          ...NavigationAssets,
          // comment/fix these until paths are correct
          // require("../assets/newspaper.png"),
          // require("../assets/bell.png"),
        ]);
      } catch (e) {
        console.warn("Error loading assets:", e);
      } finally {
        setAssetsLoaded(true);
      }
    }

    loadAssets();
  }, []);

  const onReady = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  if (!assetsLoaded) {
    return null;
  }

  return (
    <HiveProvider>
      <ThemeProvider>
        <AccountProvider>
          <NavigationContainer
            theme={theme}
            linking={{
              enabled: true,
              prefixes: [prefix],
            }}
            onReady={onReady}
          >
            <RootNavigator />
          </NavigationContainer>
        </AccountProvider>
      </ThemeProvider>
    </HiveProvider>
  );
}
