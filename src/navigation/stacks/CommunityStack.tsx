import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Community } from "../../screens/Community/Community";
import { PostDetails } from "../../screens/Community/PostDetails";

export type CommunityStackParamList = {
  Community: undefined;
  PostDetails: { user: string }; // adjust params as needed
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export const CommunityStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Community"
        component={Community}
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{ title: "Post details" }}
      />
    </Stack.Navigator>
  );
};
