import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getCookieExist, postLogin } from "../../untills/api";
import { Dimensions } from "react-native";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [error, setError] = useState("");

  useEffect(() => {
    getCookieExist()
      .then((data) => {
        if (data.status === 200) {
          navigation.navigate("Login");
        } else {
          navigation.navigate("Chatpage");
        }
      })
      .catch(() => {
        navigation.navigate("Chatpage");
      });
  }, []);

  const handleLogin = async () => {
    const data = {
      username,
      password,
    };

    try {
      const response = await postLogin(data);
      // Thành công
      navigation.navigate("Chatpage");
    } catch (error) {
      // Xử lý lỗi
      if (error.response && error.response.status === 401) {
        setError("Sai tài khoản hoặc mật khẩu!"); // Hiển thị thông báo lỗi
      } else {
        console.log("Lỗi khác", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Text style={styles.logo}>ZenChat</Text>
      </View>
      <Text style={styles.textIv}>UserName</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="gray"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <Text style={styles.textIv}>Mật Khẩu</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
      >
        <Text style={styles.forgot}>Quên mật khẩu ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 12, color: "gray" }}>
          Bạn chưa có tài khoản ?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#ff8c00" }}>
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 65,
    color: "#ff8c00",
    marginBottom: 40,
  },
  inputView: {
    width: width * 0.85,
    backgroundColor: "#ced4da",
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    position: "relative", // Đặt vị trí của phần tử cha là relative
  },
  textIv: {
    width: width * 0.7,
    margin: 4,
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 11,
    color: "gray",
  },
  inputText: {
    height: 100,
    color: "black",
    fontSize: 15,
    outlineStyle: 0,
    borderWidth: 0,
    fontWeight: "bold",
    
  },
  forgot: {
    color: "#ff8c00",
    fontSize: 12,
    fontStyle: "italic",
  },
  loginBtn: {
    width: width * 0.8,
    backgroundColor: "#ff8c00",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontWeight: "normal",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    position: "absolute", 
    bottom: 0, 
  },
});

export default Login;
