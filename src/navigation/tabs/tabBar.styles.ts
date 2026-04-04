import { Platform, StyleSheet } from 'react-native';

export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 64;

export const tabBarScreenOptions = {
    headerShown: false,
    tabBarActiveTintColor: '#F5A623',
    tabBarInactiveTintColor: '#9CA3AF',
    tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.4,
        marginBottom: Platform.OS === 'ios' ? 0 : 4,
    },
    tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E5E7EB',
        borderTopWidth: StyleSheet.hairlineWidth,
        height: TAB_BAR_HEIGHT,
        paddingTop: 8,
    },
};
