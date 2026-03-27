import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../../screens/Home/Home';
import * as React from 'react';
import TopBar from '../../components/TopBar';

export const HomeStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: true,
    header: () => <TopBar />,
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Home',
      },
    },
  },
});