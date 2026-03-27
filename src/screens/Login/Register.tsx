import { Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, TextInput, Image, View, TouchableOpacity } from 'react-native';
import { styles, background, logo } from './styles';


export function Register() {
    
    //These hold and set the values in the password and username fields
    const [userValue, setUserValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [confPassValue, setConfPassValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    

    //eventually will call login logic
    const loginPressed = () => {
        if(confPassValue != passValue) {
            alert("Password values are not equal");
        } else {
            alert("Password values are equal!")
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    //eventually will hold navigation logic
    const navigaiteToNewAccount = () => {
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
                <View style={styles.hiddenInputBox}>
                    <TextInput
                        style={styles.hiddenInput}
                        placeholder=" Password"
                        onChangeText={text => setPassValue(text)}
                        secureTextEntry={showPassword}
                        value={passValue}
                    >
                    </TextInput>
                    <TouchableOpacity style={styles.showPassword} onPress={handleShowPassword}>
                        {showPassword ? ' o ' : ' 􀋯 '}
                    </TouchableOpacity>
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
            </View>
            <View style={styles.container}></View>
        </ImageBackground>
    );
}
