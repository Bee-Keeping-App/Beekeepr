import { createNativeStackNavigator as createNativeStackNavigator_2 } from '@react-navigation/native-stack';
import { Almanac } from '../../screens/Almanac/Almanac';
import { Article } from '../../screens/Almanac/Article';
import { WeatherMap } from '../../screens/Almanac/Weather';

export const AlmanacStack = createNativeStackNavigator_2({
screens: {
Almanac: { screen: Almanac },
Article: { screen: Article },
Weather: { screen: WeatherMap },
},
});