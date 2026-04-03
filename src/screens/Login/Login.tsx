import { Text } from '@react-navigation/elements';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, TextInput, Image, View, TouchableOpacity } from 'react-native';
import { logo, background, styles } from './styles';


export function Login() {
    
    //These hold and set the values in the password and username fields
    const [userValue, setUserValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation<any>();
    

    //eventually will call login logic
    const loginPressed = () => {
        //add logic here to get status from the backend caller code
        //and then trigger the error message or not
        //same for register page

    };

    //eventually will hold navigation logic
    const navigaiteToNewAccount = () => {
        navigation.navigate('Register');
    };


    return (
        <ImageBackground source={background} style={styles.background}>
            <View style={styles.container}>
            </View>
            <View style={styles.container}>
                <View style={styles.logoBox}><Image source={logo} style={styles.logo}></Image></View>
                <TextInput
                    style={styles.input}
                    placeholder=" Username"
                    onChangeText={text => setUserValue(text)}
                    value={userValue}
                >
                </TextInput>
                <TextInput
                    style={styles.input}
                    placeholder=" Password"
                    onChangeText={text => setPassValue(text)}
                    secureTextEntry={true}
                    value={passValue}
                >
                </TextInput>
                <TouchableOpacity style={styles.loginButton} onPress={loginPressed}>
                    Login
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={navigaiteToNewAccount}>
                    Create an account
                </TouchableOpacity>
                
                <Text style={styles.errorMessage}>
                    {errorMessage}
                </Text>

            </View>
            <View style={styles.container}></View>
        </ImageBackground>
    );
}
