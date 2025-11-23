import { Assets as NavigationAssets } from "@react-navigation/elements";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { createURL } from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { Navigation } from "./navigation/AppNavigator";
import { AuthNavigation } from "./navigation/AuthNavigator";
import AccountProvider, { AccountContext } from "./Contexts/AuthContext";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL("/");

export function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  //contexts to use
  return (
    <AccountProvider>
      <RootNavigator theme={theme} />
    </AccountProvider>
  );
}

const RootNavigator: React.FC<{ theme: any }> = ({ theme }) => {
  const accountCtx = React.useContext(AccountContext);
  if (!accountCtx) return null;
  const { currentAccount, login } = accountCtx;

  const RootNav = currentAccount ? Navigation : AuthNavigation;

  return (
    <RootNav
      theme={theme}
      linking={{
        enabled: "auto",
        prefixes: [prefix],
      }}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    />
  );
};
