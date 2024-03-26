import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getCookieExist,postLogin } from "../../untills/api";


const Login = () => {
  const thongbao = useRef(null);
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [showError, setShowError] = useState(false);


//  useEffect(() => {
//     getCookieExist()
//     .then((data) => {
//       if (data.status === 200) {
//         navigation.navigate("login");
//       } else {
//         navigation.navigate("Chatpage");
//       }
//     })
//     .catch(() => {
//       navigation.navigate("Chatpage");
//     });
// }, [])

// const handleLogin = async (e) => {
//   e.preventDefault();
//   const data = {
//     username,
//     password,
//   }

//   try {
//     await postLogin(data)

//         .then(data => {
//             navigation.navigate("Chatpage");
//         })
//         .catch(err => {
//             if (err.response.status === 401) {

//                 thongbao.current.style.right = "0";
//                 setTimeout(() => {
//                     thongbao.current.style.right = "-500px";
//                 }, 1000);
//             }
//             else {
//                 console.log("Lỗi khác");
//             }
//         })
//   } catch (error) {
//     console.log(error);
//   }
// }


const handleLogin = async (e) => {
  e.preventDefault();
  const data = {
    username,
    password
  };

  try {
    const response = await postLogin(data);
    
    // Thành công
    navigation.navigate('Chatpage');
//   } catch (error) {
//     // Xử lý lỗi
//     if (error.response && error.response.status === 401) {
//       // Xử lý lỗi 401
//       thongbao.current.style.right = '0';
//       setTimeout(() => {
//         thongbao.current.style.right = '-500px';
//       }, 1000);
//     } else {
//       console.log('Lỗi khác', error);
//     }
//   }
// };

} catch (error) {
  // Xử lý lỗi
  if (error.response && error.response.status === 401) {
    setShowError(true); // Hiển thị thông báo lỗi
  } else {
    console.log('Lỗi khác', error);
  }
}
};

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Text style={styles.logo}>ZenChat</Text>
      </View>
      {showError && (
          <Text style={styles.errorMessage}>Incorrect username or password.</Text>
        )}
      <Text style={styles.textIv}>UserName</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="gray"
          value={username}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
        />
      </View>
      {/* màn hình quên mật khẩu là forgotpasswordScreen */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}> 
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "65px",
    color: "#ff8c00",
    marginBottom: 40,
  },
  inputView: {
    width: "85%",
    backgroundColor: "#ced4da",
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  textIv: {
    width: "70%",
    margin: 4,
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 11,
    color: "gray",
  },
  inputText: {
    height: 100,
    width:"100%",
    color: "black",
    fontSize: 15,
    outlineStyle : 'none',
    fontWeight: "500",
  },
  forgot: {
    color: "#ff8c00",
    fontSize: 12,
    fontStyle: "italic",
  },
  loginBtn: {
    width: "80%",
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
    fontWeight: "500",
  },
  thongbao: {
    borderWidth: 3,
    borderColor: 'black',
    padding: 30,
    borderRadius: 5,
    backgroundColor: 'rgb(210, 212, 213)',
    fontSize: 20,
    width: 300,
    color: 'rgb(223, 98, 36)',
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Login;
