import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HiveTracker } from "../../screens/HiveTracker/HiveTracker";
import { HiveDetails } from "../../screens/HiveTracker/HiveDetails";

export type HiveTrackerStackParamList = {
  HiveTracker: undefined;
  HiveDetails: { user: string };
};

const Stack = createNativeStackNavigator<HiveTrackerStackParamList>();

export const HiveTrackerStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HiveTracker"
        component={HiveTracker}
        options={{ title: "Hive Tracker" }}
      />
      <Stack.Screen
        name="HiveDetails"
        component={HiveDetails}
        options={{ title: "Hive Details" }}
      />
    </Stack.Navigator>
  );
};
