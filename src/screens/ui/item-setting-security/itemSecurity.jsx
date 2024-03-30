import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

import React, { useContext, useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { logoutUser, removeCookie } from "../../../untills/api";

const ItemSecurity = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const handlePress = () => {
    navigation.navigate("itemSecurity");
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tài khoản và bảo mật</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>

        {/* Thông tin cá nhân */}
        <TouchableOpacity
          style={styles.infoContainer}
          onPress={() => navigation.navigate("itemUpdateUser")}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.avatar }} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.detail}>Thông tin cá nhân</Text>
          </View>
          <AntDesign name="right" size={18} color="black" />
        </TouchableOpacity>

        {/* Số điện thoại */}
        <TouchableOpacity style={styles.infoContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="phone" size={24} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
          </View>
          <AntDesign name="right" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ff8c00",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    color: "white",
    marginLeft: 5,
  },
  content: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 14,
  },
});

export default ItemSecurity;
