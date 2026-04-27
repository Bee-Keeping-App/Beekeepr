import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from '../../screens/Home/Settings';

export const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: { screen: Settings, options: { headerShown: false } },
  },
});
