import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderButton, Text as HeaderText } from '@react-navigation/elements';
import { Home } from '../../screens/Home/Home';
import { Profile } from '../../screens/Home/Profile';
import { Settings } from '../../screens/Home/Settings';


export const HomeStack = createNativeStackNavigator({
screens: {
HomePage: {
screen: Home,
options: { title: 'Homepage' },
},
Profile: {
screen: Profile,
// Example deep link for @username
linking: {
path: ':user(@[a-zA-Z0-9-_]+)',
parse: { user: (v: string) => v.replace(/^@/, '') },
stringify: { user: (v: string) => `@${v}` },
},
},
Settings: {
screen: Settings,
options: ({ navigation }) => ({
presentation: 'modal',
title: 'Settings',
headerRight: () => (
<HeaderButton onPress={navigation.goBack}>
<HeaderText>Close</HeaderText>
</HeaderButton>
),
}),
},
},
});