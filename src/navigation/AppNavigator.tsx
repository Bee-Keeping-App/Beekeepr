// navigation/AppNavigator.tsx
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Tabs } from "./tabs/tabBar";
import { NotFound } from "../screens/NotFound";

export type AppStackParamList = {
  Tabs: undefined;
  NotFound: undefined;
};

const RootStack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="NotFound"
        component={NotFound}
        options={{ title: "404" }}
      />
    </RootStack.Navigator>
  );
};
