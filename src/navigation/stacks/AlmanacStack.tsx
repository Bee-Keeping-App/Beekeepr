import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Almanac } from "../../screens/Almanac/Almanac";
import { Article } from "../../screens/Almanac/Article";

export type AlmanacStackParamList = {
  Almanac: undefined;
  Article: { user: string };
};

const Stack = createNativeStackNavigator<AlmanacStackParamList>();

export const AlmanacStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Almanac"
        component={Almanac}
        options={{ title: "Almanac" }}
      />
      <Stack.Screen
        name="Article"
        component={Article}
        options={{ title: "Article" }}
      />
    </Stack.Navigator>
  );
};
