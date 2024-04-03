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
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const ItemUpdatePassword = () => {
    const nav = useNavigation();
    const { user } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);

    };
    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value)
    }
    const btnChangePass = () => {
        if (!confirmPassword || !oldPassword || !newPassword) {
            alert("Hãy điền đầy đủ dữ liệu")
        }
        if (confirmPassword === newPassword) {
            const data = {
                oldPassWord: oldPassword,
                passWord: confirmPassword,
            }
            setPasswordsMatch(true);
            updatePassword(user._id, data)
            .then((res) => {
                if (res.data.message === "PassWord is not defined") {
                    alert("Mật khẩu cũ không đúng")
                } else {
                    alert("Cập nhật PassWord thành công")
                    // console.log();
                    logoutUser({})
                    .then(res => {
                        removeCookie()
                        setTimeout(() => {
                            
                            
                            nav.navigate("Login")
                        }, 1000);

                    })
                    .catch(err => {
                        alert("Lỗi hệ thống")
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            setPasswordsMatch(false);
            alert('new password và confirm password không trùng nhau')
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
        //onChangeText={handleOldPasswordChange}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry={true}
        value={newPassword}
        // onChangeText={handleNewPasswordChange}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry={true}
        value={confirmPassword}
        // onChangeText={handleConfirmPasswordChange}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default ItemUpdatePassword;
