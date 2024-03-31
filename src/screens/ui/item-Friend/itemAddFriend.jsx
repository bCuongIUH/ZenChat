import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { logoutUser, removeCookie } from "../../../untills/api";

const ItemAddFriend = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [errForm, setErrForm] = useState("");
  const errFormRef = useRef(null);
  const regexPatterns = {
    phoneNumber: /^(0|\+84)[1-9]{9}$/,
  };

  const handleAddFriend = async (event) => {
    event.preventDefault();
    const data = {
      phoneNumber,
    };

    let processedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      processedPhoneNumber = `+84${phoneNumber.slice(1)}`;
    }
    setPhoneNumber(processedPhoneNumber);

    if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {
      setErrForm("Số điện thoại không đúng.");
      if (errFormRef.current) {
        errFormRef.current.style.top = "0";
        setTimeout(() => {
          errFormRef.current.style.top = "-100px";
        }, 3000);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* BUTTON goback để trở lại màn hình trước đó */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thêm bạn</Text>
      </View>

      {/* Thêm bạn bằng số điện thoại */}
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Nhập số điện thoại"
        />
      </View>

      {/* Nút tìm kiếm bạn */}
      <TouchableOpacity style={styles.saveButton} onPress={handleAddFriend}>
        <Text style={styles.saveButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {/* Hiển thị lỗi */}
      <View ref={errFormRef} style={styles.errorContainer}>
        <Text style={styles.errorText}>{errForm}</Text>
      </View>
    </View>
  );
};

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
});

export default ItemAddFriend;
