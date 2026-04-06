import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AnalyticsStack } from '../stacks/AnalyticsStack';
import { CommunityStack } from '../stacks/CommunityStack';
import HomeStack from '../stacks/HomeStack';
import { LogBookStack } from '../stacks/LogBookStack';
import { SettingsStack } from '../stacks/SettingsStack';

export const Tabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeStack,
      options: { headerShown: false, title: 'Home' },
    },
    Community: {
      screen: CommunityStack,
      options: { headerShown: false, title: 'Community' },
    },
    LogBook: {
      screen: LogBookStack,
      options: { headerShown: false, title: 'Log Book' },
    },
    Analytics: {
      screen: AnalyticsStack,
      options: { headerShown: false, title: 'Analytics' },
    },
    Settings: {
      screen: SettingsStack,
      options: { headerShown: false, title: 'Settings' },
    },
  },
});