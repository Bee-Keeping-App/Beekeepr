import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AnalyticsStack } from '../stacks/AnalyticsStack';
import { CommunityStack } from '../stacks/CommunityStack';
import HomeStack from '../stacks/HomeStack';
import { LogBookStack } from '../stacks/LogBookStack';
import { SettingsStack } from '../stacks/SettingsStack';

export const Tabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: '#e3ad19',
    tabBarInactiveTintColor: '#6b7280',
    tabBarLabelStyle: {
      textTransform: 'uppercase',
      fontSize: 10,
      fontWeight: '600',
    },
  },
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        title: 'Home',
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={size ?? 22} color={color} />
        ),
      },
    },
    LogBook: {
      screen: LogBookStack,
      options: {
        title: 'Log Book',
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? 'book' : 'book-outline'} size={size ?? 22} color={color} />
        ),
      },
    },
    Analytics: {
      screen: AnalyticsStack,
      options: {
        title: 'Analytics',
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? 'stats-chart' : 'stats-chart-outline'}
            size={size ?? 22}
            color={color}
          />
        ),
      },
    },
    Community: {
      screen: CommunityStack,
      options: {
        title: 'Community',
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? 'people' : 'people-outline'} size={size ?? 22} color={color} />
        ),
      },
    },
    Settings: {
      screen: SettingsStack,
      options: {
        title: 'Settings',
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size ?? 22} color={color} />
        ),
      },
    },
  },
});