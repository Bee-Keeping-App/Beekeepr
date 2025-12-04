import * as React from 'react';
import { Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from '../stacks/HomeStack';
import { AlmanacStack } from '../stacks/AlmanacStack';
import { CommunityStack } from '../stacks/CommunityStack';
import { HiveTrackerStack } from '../stacks/HiveTrackerStack';



// import homeIcon from '../../assets/home.png';
// import bookIcon from '../../assets/book.png';
// import usersIcon from '../../assets/users.png';
// import hiveIcon from '../../assets/hive.png';


export const Tabs = createBottomTabNavigator({
screens: {
Home: {
screen: HomeStack,
options: {
title: 'Homepage',
tabBarIcon: ({ color, size }) => (
// <Image source={homeIcon} tintColor={color} style={{ width: size, height: size }} />
<Text style={{ color, fontSize: size }}></Text>
),
},
},
Almanac: {
screen: AlmanacStack,
options: {
tabBarIcon: ({ color, size }) => (
// <Image source={bookIcon} tintColor={color} style={{ width: size, height: size }} />
<Text style={{ color, fontSize: size }}></Text>
),
},
},
Community: {
screen: CommunityStack,
options: {
tabBarIcon: ({ color, size }) => (
// <Image source={usersIcon} tintColor={color} style={{ width: size, height: size }} />
<Text style={{ color, fontSize: size }}></Text>
),
},
},
HiveTracker: {
screen: HiveTrackerStack,
options: {
title: 'Hive Tracker',
tabBarIcon: ({ color, size }) => (
// <Image source={hiveIcon} tintColor={color} style={{ width: size, height: size }} />
<Text style={{ color, fontSize: size }}></Text>
),
},
},
},
});