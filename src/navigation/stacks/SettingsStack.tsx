import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from '../../screens/Home/Settings';

export const SettingsStack = createNativeStackNavigator({
    screens: {
        SettingsPage: {
            screen: Settings,
            options: { headerShown: false },
        },
    },
});
