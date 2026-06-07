import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';


import { Tabs } from './tabs/tabBar';
import { NotFound } from '../screens/NotFound';
import { WeatherMap } from '../screens/Almanac/Weather';
import { LogEntry } from '../screens/LogEntry/LogEntry';


// Root-level stack: anything here sits outside the tab bar (modals, 404, auth, etc.)
const RootStack = createNativeStackNavigator({
screens: {
Tabs: {
screen: Tabs,
options: { headerShown: false },
},
WeatherModal: {
screen: WeatherMap,
options: { headerShown: false, presentation: 'fullScreenModal' },
},
LogEntry: {
screen: LogEntry,
options: { headerShown: false, presentation: 'fullScreenModal' },
},
NotFound: {
screen: NotFound,
options: { title: '404' },
linking: { path: '*' },
},

},
});


export const Navigation = createStaticNavigation(RootStack);
export type RootStackParamList = StaticParamList<typeof RootStack>;