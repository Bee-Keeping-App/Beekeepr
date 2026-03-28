import { Text } from '@react-navigation/elements';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, TextInput, Image, View, TouchableOpacity } from 'react-native';
import { styles, background, logo } from './styles';


export function Register() {
    
    //These hold and set the values in the password and username fields
    const [userValue, setUserValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [confPassValue, setConfPassValue] = useState('');
    const navigation = useNavigation<any>();

    //eventually will call login logic
    const loginPressed = () => {
        if(confPassValue != passValue) {
            alert("Password values are not equal");
        } else {
            alert("Password values are equal!")
        }
    };


    //eventually will hold navigation logic
    const navigateToLogin = () => {
        navigation.navigate('Login');
    };


    return (
        <ImageBackground source={background} style={styles.background}>
            <View style={styles.container}>
            </View>
            <View style={styles.container}>
                <View style={styles.logoBox}><Image source={logo}  style={styles.logo}></Image></View>
                <TextInput
                    style={styles.input}
                    placeholder=" Username"
                    onChangeText={text => setUserValue(text)}
                    value={userValue}
                >
                </TextInput>
                <View style={styles.hiddenInputBox}>
                    <TextInput
                        style={styles.hiddenInput}
                        placeholder=" Password"
                        onChangeText={text => setPassValue(text)}
                        secureTextEntry={true}
                        value={passValue}
                    >
                    </TextInput>
                </View>


                <TextInput
                    style={styles.input}
                    placeholder=" Confirm Password"
                    onChangeText={text => setConfPassValue(text)}
                    secureTextEntry={true}
                    value={confPassValue}
                >
                </TextInput>


                <TouchableOpacity style={styles.loginButton} onPress={loginPressed}>
                    Create Account
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerButton} onPress={navigateToLogin}>
                    Return to Login
                </TouchableOpacity>
            </View>
            <View style={styles.container}></View>
        </ImageBackground>
    );
}
