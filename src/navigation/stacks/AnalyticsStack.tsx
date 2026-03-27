import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Analytics } from '../../screens/Analytics/Analytics';
import * as React from 'react';
import TopBar from '../../components/TopBar';

export const AnalyticsStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: true,
    header: () => <TopBar />,
  },
  screens: {
    Analytics: {
      screen: Analytics,
      options: {
        title: 'Analytics',
      },
    },
  },
});