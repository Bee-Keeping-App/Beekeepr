import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApiaryManager } from '../../screens/ApiaryManager/ApiaryManager';

export const ApiaryManagerStack = createNativeStackNavigator({
  screens: {
    ApiaryManager: {
      screen: ApiaryManager,
      options: { headerShown: false }, // screen renders its own header
    },
  },
});
