import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack } from '../stacks/HomeStack';
import { HiveTrackerStack } from '../stacks/HiveTrackerStack';
import { AnalyticsStack } from '../stacks/AnalyticsStack';
import { CommunityStack } from '../stacks/CommunityStack';
import { SettingsStack } from '../stacks/SettingsStack';
import { tabBarScreenOptions } from './tabBar.styles';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, active: IoniconsName, inactive: IoniconsName) {
    return (color: string, size: number) => (
        <Ionicons name={focused ? active : inactive} size={size} color={color} />
    );
}

export const Tabs = createBottomTabNavigator({
    screenOptions: tabBarScreenOptions,
    screens: {
        Home: {
            screen: HomeStack,
            options: ({ navigation: _nav }) => ({
                title: 'Home',
                tabBarIcon: ({ color, size, focused }) =>
                    tabIcon(focused, 'home', 'home-outline')(color, size),
            }),
        },
        LogBook: {
            screen: HiveTrackerStack,
            options: ({ navigation: _nav }) => ({
                title: 'Log Book',
                tabBarIcon: ({ color, size, focused }) =>
                    tabIcon(focused, 'book', 'book-outline')(color, size),
            }),
        },
        Analytics: {
            screen: AnalyticsStack,
            options: ({ navigation: _nav }) => ({
                title: 'Analytics',
                tabBarIcon: ({ color, size, focused }) =>
                    tabIcon(focused, 'bar-chart', 'bar-chart-outline')(color, size),
            }),
        },
        Community: {
            screen: CommunityStack,
            options: ({ navigation: _nav }) => ({
                title: 'Community',
                tabBarIcon: ({ color, size, focused }) =>
                    tabIcon(focused, 'people', 'people-outline')(color, size),
            }),
        },
        Settings: {
            screen: SettingsStack,
            options: ({ navigation: _nav }) => ({
                title: 'Settings',
                tabBarIcon: ({ color, size, focused }) =>
                    tabIcon(focused, 'settings', 'settings-outline')(color, size),
            }),
        },
    },
});
