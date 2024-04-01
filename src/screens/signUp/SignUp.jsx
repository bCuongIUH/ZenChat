import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Option,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { postRegister } from "../../untills/api";
import { Auth, SignupContext } from "../../untills/context/SignupContext";
import { AuthContext } from "../../untills/context/AuthContext";

import { AxiosError } from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from 'date-fns';

export const SignUp = () => {
  const [fullName, setFullName] = useState("");
  // const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const { handler } = useContext(Auth);
  const navigation = useNavigation();

  const errFormRef = useRef([]);
  const [errForm, setErrForm] = useState("");

  const [errFullName, setErrFullName] = useState("");
  const [errPhoneNumber, setErrPhoneNumber] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassWord, setErrPassWord] = useState("");
  const [errDateOfBirth, setErrDateOfBirth] = useState("");
  const regexPatterns = {
    fullName:
      /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ]+$/,
    phoneNumber: /^(0|\+84)[1-9]{9}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passWord: /^[a-zA-Z\d]{6,}$/,
    //dateOfBirth: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  };
  useEffect(() => {
    const removeToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await AsyncStorage.removeItem("token"); // sử dụng asyncStorgae k dùng đc localStorage
        handler.setAuth(undefined);
      }
    };

    removeToken();
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const avatar =
      "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";
    const background =
      "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";

    let processedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
    }
    if (phoneNumber.startsWith("+84")) {
      processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
    }
   
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
    const data = {
      fullName,
      dateOfBirth,
      phoneNumber: processedPhoneNumber,
      email,
      passWord,
      gender,
      avatar,
      background,
    };
    try {
      await postRegister(data)
        .then((res) => {
          console.log(res.data.token);
          AsyncStorage.setItem("token", res.data.token);
          handler.setAuth(res.data.userDetail);
          navigation.navigate("OTPConfirmationForm");
        })
        .catch((err) => {
          if (AxiosError.ERR_BAD_REQUEST) {
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
    // <View>
    //   <View style={styles.wrapper}>
        // <View style={styles.errForm} ref={errFormRef}>
        //   <Text>{errForm}</Text>
        // </View>
        <View style={styles.container}>
          <Text style={styles.logo}>Sign up</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="FullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
             <Text style={styles.errorText}>{errFullName}</Text>
          </View>
         
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Text style={styles.errorText}>{errPhoneNumber}</Text>
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
          </View>
          {/* ngày sinh */}
          <View style={styles.inputView}>
            <DatePicker
              selected={dateOfBirth}
              onChange={setDateOfBirth}
              dateFormat="dd/MM/yyyy"
              placeholderText="Date of Birth"
              minDate={new Date("1900-01-01")}
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              style={datePickerStyle}
              customInput={<input style={inputStyle} />}
              dropdownStyles={{ monthDropdown: monthDropdownStyle }}
              value={format(dateOfBirth, 'dd/MM/yyyy')} 
            />
          </View>

          {/* sửa avt thành giới tính gender */}

          <View style={styles.inputViewGender}>
            <Text style={styles.genderLabel}>Giới tính:</Text>
            <View style={styles.genderOption}>
              <TouchableOpacity
                onPress={() => setGender("Nam")}
                style={[
                  styles.checkbox,
                  gender === "Nam" && styles.checkedCheckbox,
                ]}
              >
                <Text style={styles.checkboxText}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("Nữ")}
                style={[
                  styles.checkbox,
                  gender === "Nữ" && styles.checkedCheckbox,
                ]}
              >
                <Text style={styles.checkboxText}>Nữ</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------------------------------------------- */}
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
    //   </View>
    // </View>
  );
};
const datePickerStyle = {
  //fontFamily: 'Arial, sans-serif',
  fontStyle : "bold",
  backgroundColor : "#ced4da"
};

const inputStyle = {
  width: '100%',
  borderRadius: '4px',
  border: 'none',
  fontSize: '16px',
  outline: 'none',
  backgroundColor : "#ced4da",
  fontWeight: "bold",
  fontStyle: "italic",
};

const monthDropdownStyle = {
  width: 'auto',
  borderRadius: '4px',
  border: 'none',
  fontSize: '16px',
  outline: 'none', 
  backgroundColor :"#ced4da"
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height : height,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
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
  },
  inputText: {
    height: 50,
    color: "black",
    fontSize: 15,
   
    placeholderTextColor: "gray",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  signUpBtn: {
    width: width * 0.85,
    backgroundColor: "#ff8c00",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    fontWeight: "bold",
    //fontStyle: "italic",
    color: "white",
  },
  genderLabel: {
    marginBottom: 5,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  genderOption: {
    flexDirection: "row",
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  checkedCheckbox: {
    backgroundColor: "#ff8c00",
  },
  checkboxText: {
    //color: "#000",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  inputViewGender: {
    width: width * 0.85,
    marginBottom: 20,
    marginLeft : 10,
  },
});
export default SignUp;
