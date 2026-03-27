import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from '../../screens/Settings/Settings';
import * as React from 'react';
import TopBar from '../../components/TopBar';

export const SettingsStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: true,
    header: () => <TopBar />,
  },
  screens: {
    Settings: {
      screen: Settings,
      options: {
        title: 'Settings',
      },
    },
  },
});