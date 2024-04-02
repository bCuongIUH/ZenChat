import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import {
  logoutUser,
  removeCookie,
  findAuth,
  createRooms,
} from "../../../untills/api";

const ItemAddFriend = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [authFound, setAuthFound] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errForm, setErrForm] = useState("");
  const errFormRef = useRef(null);
  const regexPatterns = {
    phoneNumber:/^\(\+84\)\d{9}$/ // Sửa biểu thức chính quy
  };

  const handleFoundUser = async () => {
    const result = await findAuth(phoneNumber);
    if (result !== undefined) {
      setAuthFound([result]);
    } else {
      setAuthFound([]);
    }
  };

  const handleAddFriend = async (auth) => {

    // let processedPhoneNumber = phoneNumber.trim();

    // if (processedPhoneNumber.startsWith("0")) {
    //   processedPhoneNumber = `(+84)${processedPhoneNumber.slice(1)}`;
    //   setPhoneNumber(processedPhoneNumber);
    // }
    let processedPhoneNumber = phoneNumber.trim();
    if (phoneNumber.startsWith("0")) {
      processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
    } else if (!phoneNumber.startsWith("+84")) {
      processedPhoneNumber = `(+84)${phoneNumber}`;
    }

    if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {
      setErrForm("Số điện thoại không đúng.");
      if (errFormRef.current) {
        errFormRef.current.style.top = "0";
        setTimeout(() => {
          errFormRef.current.style.top = "-100px";
        }, 3000);
      }
    } else {
      const message = "hello"; //tao biến cứng
      const authen = [auth.email];
      const email = authen[0]; // lấy thằng đầu tiên
      const data1 = { email, message };

      createRooms(data1)
        .then((res) => {
          if (res.data.message === "Đã tạo phòng với User này ròi") {
            alert("Đã tạo phòng với User này ròi !!!");
            return;
          }
          if (res.data.status === 400) {
            alert("Không thể nhắn tin với chính bản thân mình !!!");
            return;
          } else {
            navigation.goBack();
          }
        })
        .catch((err) => {
          alert("Lỗi hệ thống");
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thêm bạn</Text>
      </View>

      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Nhập số điện thoại"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleFoundUser}>
        <Text style={styles.saveButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {authFound.map((auth, index) => (
        <View key={index} style={styles.userInfoContainer}>
          <Image source={{ uri: auth.avatar }} style={styles.avatar} />
          <Text style={styles.fullName}>{auth.fullName}</Text>
          <Text style={styles.phoneNumber}>
            Số điện thoại: {auth.phoneNumber}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddFriend(auth)}
          >
            <Text style={styles.addButtonText}>Thêm bạn</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View ref={errFormRef} style={styles.errorContainer}>
        <Text style={styles.errorText}>{errForm}</Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    paddingVertical: 20,
  },
  infoContainer: {
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20,
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: "silver",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerText: {
    fontSize: 20,
    color: "white",
    marginLeft: 5,
  },
  errorContainer: {
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "white",
  },
  userInfoContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  fullName: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
  },
  phoneNumber: {
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#ff8c00",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ItemAddFriend;
