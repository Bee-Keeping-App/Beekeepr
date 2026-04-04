import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';

import { Tabs } from './tabs/tabBar';
import { NotFound } from '../screens/NotFound';

const RootStack = createNativeStackNavigator({
    screens: {
        Tabs: {
            screen: Tabs,
            options: { headerShown: false },
        },
        NotFound: {
            screen: NotFound,
            options: { title: '404' },
            linking: { path: '*' },
        },
    },
});

// AppNavigation is the full app (tab bar + screens), shown only when signed in.
// RootGate renders this after Clerk confirms the user is authenticated.
export const AppNavigation = createStaticNavigation(RootStack);
export type RootStackParamList = StaticParamList<typeof RootStack>;
