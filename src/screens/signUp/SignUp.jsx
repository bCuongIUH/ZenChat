// import React, { useState, useContext, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { postRegister } from "../../untills/api";
// import { Auth } from "../../untills/context/SignupContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { format } from "date-fns";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from "react-datepicker";
// export const SignUp = () => {
//   const [fullName, setFullName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState(new Date());
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [passWord, setPassword] = useState("");
//   const [gender, setGender] = useState("");
//   const { handler } = useContext(Auth);
//   const navigation = useNavigation();

//   const [errFullName, setErrFullName] = useState("");
//   const [errPhoneNumber, setErrPhoneNumber] = useState("");
//   const [errEmail, setErrEmail] = useState("");
//   const [errPassWord, setErrPassWord] = useState("");
//   const [errDateOfBirth, setErrDateOfBirth] = useState("");
//   const [error, setError] = useState("");
//   const timeoutRef = useRef(null);
//   const [showPicker, setShowPicker] = useState(false);
//   const [ErrForm,setErrForm] = useState("")

//   //regax
//   const regexPatterns = {
//     fullName: /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ]+$/,
//     phoneNumber: /^\(\+84\)\d{9}$/,
//     email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//     passWord: /^[a-zA-Z\d]{6,}$/,
//   };

//   useEffect(() => {
//     const removeToken = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         await AsyncStorage.removeItem("token");
//         handler.setAuth(undefined);
//       }
//     };

//     removeToken();
//   }, []);

//   const handleSignUp = async () => {
//     // Kiểm tra và cập nhật lỗi cho trường FullName
//     if (!fullName || !regexPatterns.fullName.test(fullName)) {
//       setErrFullName("Tên chứa ký tự hoặc số. Vui lòng nhập lại!");
//       setTimeout(() => {
//         setErrFullName("");
//       }, 3000);
//       return;
//     } else {
//       setErrFullName("");
//     }

//     let processedPhoneNumber = phoneNumber;
//     if (phoneNumber.startsWith("0")) {
//       processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
//     } else if (!phoneNumber.startsWith("+84")) {
//       processedPhoneNumber = `(+84)${phoneNumber}`;
//     }

//     //Kiểm tra số điện thoại
//     if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {
//       setErrPhoneNumber("Số điện thoại không đúng.");
//       setTimeout(() => {
//         setErrPhoneNumber("");
//       }, 3000);
//       return;
//     } else {
//       setErrPhoneNumber("");
//     }

//     // Kiểm tra và cập nhật lỗi cho trường Email
//     if (!email || !regexPatterns.email.test(email)) {
//       setErrEmail("Email không đúng định dạng");
//       setTimeout(() => {
//         setErrEmail("");
//       }, 3000);
//       return;
//     } else {
//       setErrEmail("");
//     }
//     // Kiểm tra và cập nhật lỗi cho trường Password
//     if (!passWord || !regexPatterns.passWord.test(passWord)) {
//       setErrPassWord("Mật khẩu phải chứa ít nhất 6 ký tự");
//       setTimeout(() => {
//         setErrPassWord("");
//       }, 3000);
//       return;
//     } else {
//       setErrPassWord("");
//     }

//     if (
//       errFullName ||
//       errPhoneNumber ||
//       errEmail ||
//       errPassWord ||
//       errDateOfBirth
//     ) {
//       return;
//     }
//     const handleDateChange = (date) => {
//     // Kiểm tra xem ngày sinh có hợp lệ không và cập nhật giá trị
//     if (date) {
//       setDateOfBirth(date);
//       setErrDateOfBirth('');
//     } else {
//       setErrDateOfBirth('Please select your date of birth');
//     }
//   };
//     const avatar =
//       "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";
//     const background =
//       "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";

//     const data = {
//       fullName,
//       dateOfBirth, // xử lí format ngày bỏ phần đuôiii
//       phoneNumber: processedPhoneNumber,
//       email,
//       passWord,
//       gender,
//       avatar,
//       background,
//     };
//     try {
//       const res = await postRegister(data);
//       console.log(res.data.token);
//       AsyncStorage.setItem("token", res.data.token);
//       handler.setAuth(res.data.userDetail);
//       navigation.navigate("OTPConfirmationForm");
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setErrForm(err.response.data.message); 
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = setTimeout(() => {
//           setErrForm("");
//         }, 3000);
//       }
//     }
//   };
//   const handleDateChange = (date) => {
//     // Xử lý logic khi thay đổi ngày sinh
//     if (date) {
//       setDateOfBirth(date);
//       setErrDateOfBirth('');
//     } else {
//       setErrDateOfBirth('Please select your date of birth');
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>Sign up</Text>
//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.inputText}
//           placeholder="FullName"
//           value={fullName}
//           onChangeText={(text) => setFullName(text)}
//         />
//         <Text style={styles.errorText}>{errFullName}</Text>
//       </View>

//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.inputText}
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChangeText={(text) => setPhoneNumber(text)}
//         />
//         <Text style={styles.errorText}>{errPhoneNumber}</Text>
//       </View>

//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.inputText}
//           placeholder="Email"
//           value={email}
//           onChangeText={(text) => setEmail(text)}
//         />
//         <Text style={styles.errorText}>{errEmail}</Text>
//       </View>

//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.inputText}
//           placeholder="Password"
//           value={passWord}
//           onChangeText={(text) => setPassword(text)}
//           secureTextEntry
//         />
//         <Text style={styles.errorText}>{errPassWord}</Text>
//       </View>

//       {/* Ngày sinh */}
//       {/* <View style={styles.inputView}>
//         <TouchableOpacity
//           onPress={() => setShowPicker(true)}
//           style={styles.inputText}
//         >
//           <Text>{format(dateOfBirth, "dd-MM-yyyy")}</Text>
//         </TouchableOpacity>
//         {showPicker && (
//           <DateTimePicker
//             value={dateOfBirth}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowPicker(false);
//               if (selectedDate) {
//                 setDateOfBirth(selectedDate);
//               }
//             }}
//           />
//         )}
//         <Text style={styles.errorText}>{errDateOfBirth}</Text>
//       </View> */}
//  {/* Ngày sinh */}
//  <View style={styles.inputView}>
//       <DatePicker
//         selected={dateOfBirth}
//         onChange={handleDateChange}
//         dateFormat="dd/MM/yyyy"
//         placeholderText="Date of Birth"
//         minDate={new Date("1900-01-01")}
//         maxDate={new Date()}
//         showMonthDropdown
//         showYearDropdown
//         dropdownMode="select"
//         style={styles.datePickerStyle}
//         customInput={<TextInput style={styles.inputStyle} />}
//       />
//         <Text style={styles.errorText}>{errDateOfBirth}</Text>
//       </View>
//       {/* Giới tính */}
//       <View style={styles.inputViewGender}>
//         <Text style={styles.genderLabel}>Giới tính:</Text>
//         <View style={styles.genderOption}>
//           <TouchableOpacity
//             onPress={() => setGender("Nam")}
//             style={[
//               styles.checkbox,
//               gender === "Nam" && styles.checkedCheckbox,
//             ]}
//           >
//             <Text style={styles.checkboxText}>Nam</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setGender("Nữ")}
//             style={[styles.checkbox, gender === "Nữ" && styles.checkedCheckbox]}
//           >
//             <Text style={styles.checkboxText}>Nữ</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Button Đăng Ký */}
//       <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
//         <Text style={styles.loginText}>Đăng Ký</Text>
//       </TouchableOpacity>

//       {/* Đăng nhập */}
//       <View style={{ flexDirection: "row" }}>
//         <Text style={{ fontSize: 12, color: "gray" }}>
//           Bạn đã có tài khoản ?{" "}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//           <Text style={{ fontSize: 13, fontWeight: "bold", color: "#ff8c00" }}>
//             Đăng Nhập
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.errorText}>{ErrForm}</Text>
//     </View>
//   );
// };

// const { width } = Dimensions.get("window");
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     width: width,
//   },
//   logo: {
//     fontWeight: "bold",
//     fontSize: 50,
//     color: "#ff8c00",
//     marginBottom: 40,
//   },
//   inputView: {
//     width: width * 0.85,
//     backgroundColor: "#ced4da",
//     borderRadius: 10,
//     height: 50,
//     marginBottom: 20,
//     justifyContent: "center",
//     padding: 20,
//   },
//   inputText: {
//     height: 50,
//     color: "black",
//     fontSize: 15,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   signUpBtn: {
//     width: width * 0.85,
//     backgroundColor: "#ff8c00",
//     borderRadius: 25,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//     marginBottom: 10,
//   },
//   loginText: {
//     fontWeight: "bold",
//     color: "white",
//   },
//   genderLabel: {
//     marginBottom: 5,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   genderOption: {
//     flexDirection: "row",
//   },
//   checkbox: {
//     borderWidth: 1,
//     borderColor: "#ced4da",
//     borderRadius: 5,
//     marginRight: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   checkedCheckbox: {
//     backgroundColor: "#ff8c00",
//   },
//   checkboxText: {
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   inputViewGender: {
//     width: width * 0.85,
//     marginBottom: 20,
//     marginLeft: 10,
//   },
//   errorText: {
//     color: "red",
//     fontStyle: "italic",
//     marginTop: 5,
//   },
// });

// export default SignUp;
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { postRegister } from "../../untills/api";
import { Auth } from "../../untills/context/SignupContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

export const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({ day: "", month: "", year: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const { handler } = useContext(Auth);
  const navigation = useNavigation();

  const [errFullName, setErrFullName] = useState("");
  const [errPhoneNumber, setErrPhoneNumber] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassWord, setErrPassWord] = useState("");
  const [errDateOfBirth, setErrDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);
  const [ErrForm, setErrForm] = useState("");

  const regexPatterns = {
    fullName: /^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ]+$/,
    phoneNumber: /^\(\+84\)\d{9}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passWord: /^[a-zA-Z\d]{6,}$/,
  };

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

  const handleSignUp = async () => {
    if (!fullName || !regexPatterns.fullName.test(fullName)) {
      setErrFullName("Tên chứa ký tự hoặc số. Vui lòng nhập lại!");
      setTimeout(() => {
        setErrFullName("");
      }, 3000);
      return;
    } else {
      setErrFullName("");
    }

    let processedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
    } else if (!phoneNumber.startsWith("+84")) {
      processedPhoneNumber = `(+84)${phoneNumber}`;
    }

    if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {
      setErrPhoneNumber("Số điện thoại không đúng.");
      setTimeout(() => {
        setErrPhoneNumber("");
      }, 3000);
      return;
    } else {
      setErrPhoneNumber("");
    }

    if (!email || !regexPatterns.email.test(email)) {
      setErrEmail("Email không đúng định dạng");
      setTimeout(() => {
        setErrEmail("");
      }, 3000);
      return;
    } else {
      setErrEmail("");
    }

    if (!passWord || !regexPatterns.passWord.test(passWord)) {
      setErrPassWord("Mật khẩu phải chứa ít nhất 6 ký tự");
      setTimeout(() => {
        setErrPassWord("");
      }, 3000);
      return;
    } else {
      setErrPassWord("");
    }

    if (!dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      setErrDateOfBirth("Please select your date of birth");
      setTimeout(() => {
        setErrDateOfBirth("");
      }, 3000);
      return;
    }

    const avatar = "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";
    const background = "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";

    const data = {
      fullName,
      dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`,
      phoneNumber: processedPhoneNumber,
      email,
      passWord,
      gender,
      avatar,
      background,
    };

    try {
      const res = await postRegister(data);
      AsyncStorage.setItem("token", res.data.token);
      handler.setAuth(res.data.userDetail);
      navigation.navigate("OTPConfirmationForm");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrForm(err.response.data.message);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setErrForm("");
        }, 3000);
      }
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  const months = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({ label: `${currentYear - i}`, value: currentYear - i }));

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign up</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="FullName"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <Text style={styles.errorText}>{errFullName}</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <Text style={styles.errorText}>{errPhoneNumber}</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.errorText}>{errEmail}</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          value={passWord}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Text style={styles.errorText}>{errPassWord}</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setDateOfBirth((prev) => ({ ...prev, day: value }))}
          items={days}
          placeholder={{ label: "Day", value: null }}
          value={dateOfBirth.day}
        />
        <RNPickerSelect
          onValueChange={(value) => setDateOfBirth((prev) => ({ ...prev, month: value }))}
          items={months}
          placeholder={{ label: "Month", value: null }}
          value={dateOfBirth.month}
        />
        <RNPickerSelect
          onValueChange={(value) => setDateOfBirth((prev) => ({ ...prev, year: value }))}
          items={years}
          placeholder={{ label: "Year", value: null }}
          value={dateOfBirth.year}
        />
        <Text style={styles.errorText}>{errDateOfBirth}</Text>
      </View>

      <View style={styles.inputViewGender}>
        <Text style={styles.genderLabel}>Giới tính:</Text>
        <View style={styles.genderOption}>
          <TouchableOpacity
            onPress={() => setGender("Nam")}
            style={[styles.checkbox, gender === "Nam" && styles.checkedCheckbox]}
          >
            <Text style={styles.checkboxText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGender("Nữ")}
            style={[styles.checkbox, gender === "Nữ" && styles.checkedCheckbox]}
          >
            <Text style={styles.checkboxText}>Nữ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
        <Text style={styles.loginText}>Đăng Ký</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 12, color: "gray" }}>Bạn đã có tài khoản ?{" "}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#ff8c00" }}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.errorText}>{ErrForm}</Text>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: width,
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
    fontWeight: "bold",
    fontStyle: "italic",
  },
  inputViewGender: {
    width: width * 0.85,
    marginBottom: 20,
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontStyle: "italic",
    marginTop: 5,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    backgroundColor: "#ced4da",
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    padding: 20,
  },
});

export default SignUp;
