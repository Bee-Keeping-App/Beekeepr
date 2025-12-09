import { Text } from "@react-navigation/elements";
import { StaticScreenProps } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ImageBackground,
  TextInput,
  Image,
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

export function Login() {
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

    if (!userValue || !passValue) {
      alert("Please enter both username and password.");
      return;
    }

    if (accountCtx?.login) {
      accountCtx.login(userValue, passValue).catch((err) => {
        console.error("Login failed:", err);
        alert("Login failed. Please check your credentials and try again.");
      });
    } else {
      console.warn("AccountContext or login function is not available");
    }
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
    navigation.navigate("Register");
  };

  return (
    //don't like this local based navigation to the background image but I'm not sure where // starts us until i double check`
    <ImageBackground
      source={require("../../../assets/placeholderBackground.png")}
      style={styles.background}
    >
      <View style={styles.container}></View>
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Image
            source={require("../../../assets/placeholderLogo.png")}
            style={styles.logo}
          ></Image>
        </View>
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
          Login
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={navigaiteToNewAccount}
        >
          Create an account
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
  logo: {
    flex: 1,
    tintColor: "black",
    justifyContent: "center",
    resizeMode: "contain",
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.2,
    height: width * 0.2,
    backgroundColor: "darkorange",
    borderRadius: 14,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: width * 0.5,
    borderColor: "darkgray",
    backgroundColor: "gray",
    borderWidth: 2,
    borderRadius: 5,
    color: "lightgray",
  },
  loginButton: {
    width: width * 0.5,
    backgroundColor: "darkorange",
    color: "lightgray",
    borderColor: "darkgray",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButton: {
    width: width * 0.5,
    color: "darkorange",
    borderColor: "darkorange",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
});
