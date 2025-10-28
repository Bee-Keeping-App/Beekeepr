import { createNativeStackNavigator as createNativeStackNavigator_4 } from '@react-navigation/native-stack';
import { HiveTracker } from '../../screens/HiveTracker/HiveTracker';
import { HiveDetails } from '../../screens/HiveTracker/HiveDetails';


export const HiveTrackerStack = createNativeStackNavigator_4({
screens: {
HiveTracker: { screen: HiveTracker },
HiveDetails: { screen: HiveDetails },
},
});