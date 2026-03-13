import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Community } from '../../screens/Community/Community';

export const CommunityStack = createNativeStackNavigator({
  screens: {
    Community: {
      screen: Community,
      options: {
        title: 'Community',
      },
    },
  },
});