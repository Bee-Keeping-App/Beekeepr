import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation } from "@react-navigation/native";

import { Demo } from "../screens/Login/demo";
// import { RegisterScreen } from "../screens/RegisterScreen";

const AuthStack = createNativeStackNavigator({
  screens: {
    Demo: {
      screen: Demo,
    },
    // Register: {
    //   screen: RegisterScreen,
    // },
  },
});

export const AuthNavigation = createStaticNavigation(AuthStack);
