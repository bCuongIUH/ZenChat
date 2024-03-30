import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { postRegister } from "../../untills/api";
import { Auth, SignupContext } from "../../untills/context/SignupContext";
import { AuthContext } from "../../untills/context/AuthContext";

import { AxiosError } from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const { handler } = useContext(Auth);
  const navigation = useNavigation();

  const errFormRef = useRef([]);
  const [errForm, setErrForm] = useState("");

  const regexPatterns = {
    fullName: /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ]+$/,
    phoneNumber: /^(0|\+84)[1-9]{9}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passWord: /^[a-zA-Z\d]{6,}$/,
    dateOfBirth: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setDateOfBirth(date);
  };

  // useEffect(() => {
  //   const token = AsyncStorage.getItem("token");
  //   if (token) {
  //     AsyncStorage.removeItem("token");
  //     handler.setAuth(undefined);
  //   }
  // });
  useEffect(() => {
    const removeToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await AsyncStorage.removeItem("token");
        handler.setAuth(undefined);
      }
    };
  
    removeToken();
  }, []);
  
  const handleSignUp = async (event) => {
    event.preventDefault();
    const data = {
      fullName,
      dateOfBirth,
      phoneNumber,
      email,
      passWord,
      avatar,
    };

    let processedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      processedPhoneNumber = `+84${phoneNumber.slice(1)}`;
    }
    setPhoneNumber(processedPhoneNumber);


    if (!regexPatterns.fullName.test(fullName)) {
      setErrForm("Please enter the name in the correct format.");
      errFormRef.current.style.top = "0";
      setTimeout(() => {
        errFormRef.current.style.top = "-100px";
      }, 3000);
      return;
    }

    if (!regexPatterns.email.test(email)) {
      setErrForm("Please enter email address in correct format.");
      errFormRef.current.style.top = "0";
      setTimeout(() => {
        errFormRef.current.style.top = "-100px";
      }, 3000);
      return;
    }
    if (!regexPatterns.dateOfBirth.test(dateOfBirth)) {
      setErrForm("Please enter dateOfBirth in correct format(dd/mm/yyyy).");
      errFormRef.current.style.top = "0";
      setTimeout(() => {
        errFormRef.current.style.top = "-100px";
      }, 3000);
      return;
    }
    try {
      await postRegister(data)
        .then((res) => {  
          console.log(res.data.token);
          AsyncStorage.setItem("token", res.data.token);
          handler.setAuth(res.data.userDetail);
          navigation.navigate("OTPConfirmationForm");
          // navigation.navigate("Login");
        })
    // try {
    //   await postRegister(data)
    //     .then((res) => {
    //       const token = res.data.token;
    //       if (token) {
    //         AsyncStorage.setItem("token", token);
    //         handler.setAuth(res.data.userDetail);
    //         navigation.navigate("OTPConfirmationForm");
    //       } else {
    //         console.log("Token is empty or invalid.");
    //       }
    //     })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            setErrForm(err.response.data.message);
            errFormRef.current.style.top = "0";
            setTimeout(() => {
              errFormRef.current.style.top = "-100px";
            }, 3000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.errForm} ref={errFormRef}>
          <Text>{errForm}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.logo}>Sign up</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="FullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            {/* 
          <div style={{ width: "2px" }}>
            <DatePicker
              selected={dateOfBirth}
              onChange={handleDateChange}
              dateFormat="dd/MM"
              placeholderText="Date of Birth"
              style={{ fontSize: "14px", width: "10 px" }}
            />
          </div> 
          */}
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              value={passWord}
              onChange={(e) => setPassword(e.target.value)}
              secureTextEntry
            />
            <View style={styles.eyeIcon}>{/* Add your eye icon here */}</View>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </View>
          <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
            <Text style={styles.loginText}>Đăng Ký</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 12, color: "gray" }}>
              Bạn đã có tài khoản ?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{ fontSize: 13, fontWeight: "bold", color: "#ff8c00" }}
              >
                Đăng Nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    width: "100%",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
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
  flname: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
  },
  inputText: {
    height: 100,
    width: "100%",
    color: "black",
    fontSize: 15,
    outlineStyle: "none",
    fontWeight: "500",
    placeholderTextColor: "gray",
    fontStyle: "italic",
  },
  forgot: {
    color: "#003f5c",
    fontSize: 11,
  },
  signUpBtn: {
    width: "80%",
    backgroundColor: "#ff8c00",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
  buttonDate: {
    width: "30px",
    height: "30px",
    borderradius: "50px",
  },
});

export default SignUp;


