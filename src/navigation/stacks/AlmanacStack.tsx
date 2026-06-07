import { createNativeStackNavigator as createNativeStackNavigator_2 } from '@react-navigation/native-stack';
import { Almanac } from '../../screens/Almanac/Almanac';
import { Article } from '../../screens/Almanac/Article';
import { HiveDetails } from '../../screens/HiveTracker/HiveDetails';

export const AlmanacStack = createNativeStackNavigator_2({
  screens: {
    Almanac: { screen: Almanac, options: { headerShown: false } },
    Article: { screen: Article, options: { headerShown: false } },
    HiveDetails: { screen: HiveDetails, options: { headerShown: false } },
  },
});
