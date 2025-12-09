// navigation/tabs/tabBar.tsx
import * as React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeStack } from "../stacks/HomeStack";
import { AlmanacStack } from "../stacks/AlmanacStack";
import { CommunityStack } from "../stacks/CommunityStack";
import { HiveTrackerStack } from "../stacks/HiveTrackerStack";

export type TabParamList = {
  Home: undefined;
  Almanac: undefined;
  Community: undefined;
  HiveTracker: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const Tabs: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Homepage",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Almanac"
        component={AlmanacStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📘</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="HiveTracker"
        component={HiveTrackerStack}
        options={{
          title: "Hive Tracker",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🐝</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
