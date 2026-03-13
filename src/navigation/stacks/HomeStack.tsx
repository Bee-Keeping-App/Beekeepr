import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../../screens/Home/Home';

export const HomeStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Home',
      },
    },
  },
});