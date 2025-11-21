import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../../screens/Login/Login';
import { Register } from '../../screens/Login/Register';

export const LoginStack = createNativeStackNavigator({
screens: {
    LoginPage: {
        screen: Login,
        options: ({
            headerShown: false,
        })

    },
    RegisterPage: {
        screen: Register,
        options: ({
            headerShown: false,
        })
    },
},
});