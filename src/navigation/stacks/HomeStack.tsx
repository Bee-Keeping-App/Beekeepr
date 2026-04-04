import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../../screens/Home/Home';
import { Profile } from '../../screens/Home/Profile';

export const HomeStack = createNativeStackNavigator({
    screens: {
        HomePage: {
            screen: Home,
            options: { headerShown: false },
        },
        Profile: {
            screen: Profile,
            options: { headerShown: false },
            linking: {
                path: ':user(@[a-zA-Z0-9-_]+)',
                parse: { user: (v: string) => v.replace(/^@/, '') },
                stringify: { user: (v: string) => `@${v}` },
            },
        },
    },
});
