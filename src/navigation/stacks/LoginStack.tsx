import { createNativeStackNavigator  as  createNativeStackNavigator_1 } from '@react-navigation/native-stack';
import { Login } from '../../screens/Login/Login';
import { Register } from '../../screens/Login/Register';

export const LoginStack = createNativeStackNavigator_1({
screens: {
Login: { screen: Login },
Register: { screen: Register }
},
});