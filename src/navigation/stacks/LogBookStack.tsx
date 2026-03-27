import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBook } from '../../screens/LogBook/LogBook';
import * as React from 'react';
import TopBar from '../../components/TopBar';

export const LogBookStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: true,
    header: () => <TopBar />,
  },
  screens: {
    LogBook: {
      screen: LogBook,
      options: {
        title: 'Log Book',
      },
    },
  },
});