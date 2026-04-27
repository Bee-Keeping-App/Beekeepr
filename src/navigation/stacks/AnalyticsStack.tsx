import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Analytics } from '../../screens/Analytics/Analytics';

export const AnalyticsStack = createNativeStackNavigator({
  screens: {
    Analytics: { screen: Analytics, options: { headerShown: false } },
  },
});
