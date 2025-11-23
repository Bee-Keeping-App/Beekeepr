import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation } from "@react-navigation/native";

import { Login } from "../screens/Login/Login";
import { Register } from "../screens/Login/Resgister";

const AuthStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
    },
    Register: {
      screen: Register,
    },
  },
});

export const AuthNavigation = createStaticNavigation(AuthStack);
