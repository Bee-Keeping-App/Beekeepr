import { StyleSheet, Dimensions } from 'react-native';
import backgroundImage from '../../assets/placeholderBackground.png';
import logoImage from '../../assets/placeholderLogo.png';

const { width, height } = Dimensions.get('window');

export const logo = logoImage;
export const background = backgroundImage;
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 0,
    },
    background: {
        flex: 1,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: '100%',
    },
    logo: {
        flex: 1,
        tintColor: 'black',
        justifyContent: 'center',
        resizeMode: 'contain',
    },
    logoBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.2,
        height: width * 0.2,
        backgroundColor: 'darkorange',
        borderRadius: 14,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    hiddenInputBox: {
        flexDirection: 'row',
        width: width * 0.5,
    },
    hiddenInput: {
        flex: 1,
        borderColor: 'darkgray',
        backgroundColor: 'gray',
        borderWidth: 2,
        borderRadius: 5,
        color: 'lightgray',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    input: {
        width: width * 0.5,
        borderColor: 'darkgray',
        backgroundColor: 'gray',
        borderWidth: 2,
        borderRadius: 5,
        color: 'lightgray',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    showPassword: {
        color: 'white',
        borderColor: 'darkgray',
        backgroundColor: 'gray',
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    loginButton: {
        width: width * 0.5,
        backgroundColor: 'darkorange',
        color: 'lightgray',
        borderColor: 'darkgray',
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'center',
    },
    registerButton: {
        width: width * 0.5,
        color: 'darkorange',
        borderColor: 'darkorange',
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'center',
    },
});
