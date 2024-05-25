import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { logoutUser, removeCookie, updatePassword } from "../../../untills/api";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ItemUpdatePassword = () => {
  const nav = useNavigation();
  const { user } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const btnChangePass = () => {
    if (!confirmPassword || !oldPassword || !newPassword) {
      setMessageType("error");
      setMessage("Hãy điền đầy đủ dữ liệu");
      return;
    }

    if (confirmPassword === newPassword) {
      const data = {
        oldPassWord: oldPassword,
        passWord: confirmPassword,
      };
      setPasswordsMatch(true);
      updatePassword(user._id, data)
        .then((res) => {
          if (res.data.message === "PassWord is not defined") {
            setMessageType("error");
            setMessage("Mật khẩu cũ không đúng");
          } else {
            setMessageType("success");
            setMessage("Cập nhật PassWord thành công");
            logoutUser({})
              .then(res => {
                removeCookie();
                setTimeout(() => {
                  nav.navigate("Login");
                }, 1000);
              })
              .catch(err => {
                setMessageType("error");
                setMessage("Lỗi hệ thống");
              });
          }
        })
        .catch((err) => {
          setMessageType("error");
          setMessage("Đã xảy ra lỗi khi cập nhật mật khẩu.");
          console.log(err);
        });
    } else {
      setPasswordsMatch(false);
      setMessageType("error");
      setMessage("New password và confirm password không trùng nhau");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SignUp</Text>
      </View>
      <Text style={styles.heading}>Đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry={true}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry={true}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry={true}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {message ? (
        <Text style={[styles.message, messageType === "error" ? styles.error : styles.success]}>
          {message}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={btnChangePass}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#ff8c00",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    textAlign: "center",
  },
  error: {
    color: "red",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  success: {
    color: "green",
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
});

export default ItemUpdatePassword;
