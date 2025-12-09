// navigation/stacks/HomeStack.tsx
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton, Text as HeaderText } from "@react-navigation/elements";

import { Home } from "../../screens/Home/Home";
import { Profile } from "../../screens/Home/Profile";
import { Settings } from "../../screens/Home/Settings";

export type HomeStackParamList = {
  HomePage: undefined;
  Profile: { user: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={Home}
        options={{ title: "Homepage" }}
      />

      <Stack.Screen name="Profile" component={Profile} />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          presentation: "modal",
          title: "Settings",
          headerRight: () => (
            <HeaderButton onPress={navigation.goBack}>
              <HeaderText>Close</HeaderText>
            </HeaderButton>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
