import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignIn = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ImageBackground
      source={require("./image.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignIn} style={styles.buttonSignIn}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp} style={styles.buttonSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", 
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  buttonSignIn: {
    padding: 10,
    marginHorizontal: 10,
    width: 300,
    backgroundColor: "orange",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonSignUp: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
    alignItems: "center",
    backgroundColor: "silver",
    borderRadius: 15,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
