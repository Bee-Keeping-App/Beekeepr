import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Community } from '../../screens/Community/Community';
import * as React from 'react';
import TopBar from '../../components/TopBar';

export const CommunityStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: true,
    header: () => <TopBar />,
  },
  screens: {
    Community: {
      screen: Community,
      options: {
        title: 'Community',
      },
    },
  },
});