import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBook } from '../../screens/LogBook/LogBook';

export const LogBookStack = createNativeStackNavigator({
  screens: {
    LogBook: {
      screen: LogBook,
      options: {
        title: 'Log Book',
      },
    },
  },
});