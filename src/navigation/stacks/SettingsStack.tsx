import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from '../../screens/Settings/Settings';

export const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: {
      screen: Settings,
      options: {
        title: 'Settings',
      },
    },
  },
});