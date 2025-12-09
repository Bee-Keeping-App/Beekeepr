import { Text } from "@react-navigation/elements";
import { StaticScreenProps } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ImageBackground,
  TextInput,
  Button,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

import { useContext } from "react";
import { AccountContext } from "../../Contexts/AuthContext";

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

export function Register() {
  //These hold and set the values in the password and username fields
  const [userValue, setUserValue] = useState("");
  const [passValue, setPassValue] = useState("");

  const navigation = useNavigation<AuthNavProp>();
  const accountCtx = useContext(AccountContext);

  //eventually will call login logic
  const loginPressed = () => {
    alert(
      "The entered login value is " +
        userValue +
        " and the entered password is " +
        passValue
    );
  };

  const guestLoginPressed = () => {
    if (accountCtx?.guestLogin) {
      accountCtx.guestLogin().catch((err) => {
        console.error("Guest login failed:", err);
        alert("Guest login failed. Please try again.");
      });
    } else {
      console.warn("AccountContext or guestLogin function is not available");
    }
  };

  //eventually will hold navigation logic
  const navigaiteToNewAccount = () => {
    navigation.navigate("Login");
  };

  return (
    //don't like this local based navigation to the background image but I'm not sure where // starts us until i double check`
    <ImageBackground
      source={require("../../../assets/placeholderBackground.png")}
      style={styles.background}
    >
      <View style={styles.container}></View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder=" Username"
          onChangeText={(text) => setUserValue(text)}
          value={userValue}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder=" Password"
          onChangeText={(text) => setPassValue(text)}
          secureTextEntry={true}
          value={passValue}
        ></TextInput>
        <TouchableOpacity style={styles.loginButton} onPress={loginPressed}>
          Sign Up
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={navigaiteToNewAccount}
        >
          Already have an Account?
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.registerButton, { marginTop: 10 }]}
          onPress={guestLoginPressed}
        >
          <Text style={{ color: "darkorange", padding: 6 }}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}></View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 0,
  },
  background: {
    flex: 1,
    resizeMode: "contain", // Or 'contain', 'stretch', 'repeat', 'center'
    justifyContent: "center",
    alignItems: "center",
    //width: width,
    width: width,
    height: "100%",
  },
  overlayContent: {
    // Styles for the content placed on top of the image
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: width * 0.6,
    borderColor: "darkgray",
    backgroundColor: "gray",
    borderWidth: 2,
    borderRadius: 5,
    color: "lightgray",
  },
  loginButton: {
    width: width * 0.6,
    backgroundColor: "darkorange",
    color: "lightgray",
    borderColor: "darkgray",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButton: {
    width: width * 0.6,
    color: "darkorange",
    borderColor: "darkorange",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
});
