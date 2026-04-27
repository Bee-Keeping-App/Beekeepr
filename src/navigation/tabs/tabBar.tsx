import * as React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from '../stacks/HomeStack';
import { AlmanacStack } from '../stacks/AlmanacStack';
import { AnalyticsStack } from '../stacks/AnalyticsStack';
import { CommunityStack } from '../stacks/CommunityStack';
import { SettingsStack } from '../stacks/SettingsStack';

const AMBER = '#F59E0B';

export const Tabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: AMBER,
    tabBarInactiveTintColor: '#6B7280',
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
    tabBarStyle: { paddingBottom: 4, paddingTop: 4, height: 60 },
  },
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        title: 'HOME',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ color, fontSize: size - 2 }}>🏠</Text>
        ),
      },
    },
    LogBook: {
      screen: AlmanacStack,
      options: {
        title: 'LOG BOOK',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ color, fontSize: size - 2 }}>📖</Text>
        ),
      },
    },
    Analytics: {
      screen: AnalyticsStack,
      options: {
        title: 'ANALYTICS',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ color, fontSize: size - 2 }}>📊</Text>
        ),
      },
    },
    Community: {
      screen: CommunityStack,
      options: {
        title: 'COMMUNITY',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ color, fontSize: size - 2 }}>👥</Text>
        ),
      },
    },
    Settings: {
      screen: SettingsStack,
      options: {
        title: 'SETTINGS',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ color, fontSize: size - 2 }}>⚙️</Text>
        ),
      },
    },
  },
});
