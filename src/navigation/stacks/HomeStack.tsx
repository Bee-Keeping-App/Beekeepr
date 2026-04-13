import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home/Home";
import { WeatherMap } from "../../screens/Home/Weather";
import TopBar from "../../components/TopBar";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <TopBar />,
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />

      <Stack.Screen
        name="Weather"
        component={WeatherMap}
        options={{ title: "Weather" }}
      />
    </Stack.Navigator>
  );
}