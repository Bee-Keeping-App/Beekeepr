import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import { AccountContext } from "../Contexts/AuthContext";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";

export type RootStackParamList = {
  AuthFlow: undefined;
  AppFlow: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const accountCtx = React.useContext(AccountContext);

  if (!accountCtx) return null;

  const { currentAccount, authLoading } = accountCtx as {
    currentAccount: any;
    authLoading?: boolean;
  };

  const isSignedIn = !!currentAccount;

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <RootStack.Screen name="AppFlow" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};
