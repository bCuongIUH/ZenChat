import React, { useContext, useState } from "react";
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

const ItemUpdateUser = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [fullName, setfullName] = useState(user.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
  const [gender, setGender] = useState(user.gender);

  const handleSave = () => {};

  return (
    <View style={styles.container}>
      {/*  */}
      <View style={styles.header}>
        {/* BUTTON goback để trở lại màn hình trc đó */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông tin tài khoản</Text>
      </View>

      {/* Avt và Bgr img */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => console.log("Chỉnh sửa hình ảnh")}
      >
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backgroundImageContainer}
        onPress={() => console.log("Chỉnh sửa ảnh bìa đi OK")}
      >
        <Image source={{ uri: user.avatar }} style={styles.backgroundImage} />
      </TouchableOpacity>

      {/* Tên */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tên ZenChat</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setfullName}
          placeholder="Nhập tên của bạn"
        />
      </View>

      {/* Ngày sinh */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="Nhập ngày sinh của bạn"
        />
      </View>

      {/* Giới tính */}
      <View style={styles.genderContainer}>
        <Text style={styles.labelGender}>Giới tính</Text>
        <View style={styles.genderOptions}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Nam" && styles.selectedGenderOption,
            ]}
            onPress={() => setGender("Nam")}
          >
            {gender === "Nam" && (
              <AntDesign name="check" size={18} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.genderText}>Nam</Text>

          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Nữ" && styles.selectedGenderOption,
            ]}
            onPress={() => setGender("Nữ")}
          >
            {gender === "Nữ" && (
              <AntDesign name="check" size={18} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.genderText}>Nữ</Text>
        </View>
      </View>

      {/* Nút lưu chỉnh sửa */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    //paddingHorizontal: 10,
    paddingVertical: 20,
    width: "auto",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  backgroundImageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  backgroundImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  labelGender: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    width: "50px",
    justifyContent: "flex-end",
  },

  genderContainer: {
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  selectedGenderOption: {
    backgroundColor: "#ff8c00",
    borderColor: "#ff8c00",
  },
  genderText: {
    fontSize: 16,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "silver",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight:20,
    marginLeft:20
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
});

export default ItemUpdateUser;
