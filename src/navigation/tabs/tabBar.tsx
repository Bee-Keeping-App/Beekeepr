import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeStack } from '../stacks/HomeStack';
import { LogBookStack } from '../stacks/LogBookStack';
import { AnalyticsStack } from '../stacks/AnalyticsStack';
import { CommunityStack } from '../stacks/CommunityStack';
import { SettingsStack } from '../stacks/SettingsStack';

export const Tabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        tabBarLabel: 'Home',
      },
    },
    LogBook: {
      screen: LogBookStack,
      options: {
        tabBarLabel: 'Log Book',
      },
    },
    Analytics: {
      screen: AnalyticsStack,
      options: {
        tabBarLabel: 'Analytics',
      },
    },
    Community: {
      screen: CommunityStack,
      options: {
        tabBarLabel: 'Community',
      },
    },
    Settings: {
      screen: SettingsStack,
      options: {
        tabBarLabel: 'Settings',
      },
    },
  },
});