import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  MaterialIcons,
  Octicons,
  Fontisto,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { logoutUser, removeCookie, deleteAccount } from "../../../untills/api";

const ItemSetting = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const handleSignOut = () => {
    logoutUser({})
      .then((res) => {
        removeCookie();
        window.location.href = "Login";
        //navigation.navigate("Login")
      })
      .catch((err) => {
    
        console.log("lỗi");
      });
  };
  const handlePress = () => {
    // Xử lý sự kiện khi button được nhấn
    navigation.navigate("ItemSecurity");
  };
  const handlePressPassword=()=>{
    navigation.navigate("ItemUpdatePassword")
  }
  //xóa acc 
  const handledeleaccount = () => {
        
    deleteAccount(user._id)
    .then((res) => {
        if(res.data === true){
            alert("Xóa thành account")
            window.location.href = '/login';   
        } else {
            alert("Xóa account không thành công")
        }
    })
    .catch((err) => {
        alert("Lỗi Server")
    })
    // navigate('/page');
}
  return (
    <ScrollView style={{ flex: 1 }}>
      <ImageBackground
        style={styles.imageBackground}
        source={{ uri: user.avatar }}
      >
        <View>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Cài đặt</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {/* center các button trong setting */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons
                  name="security"
                  size={30}
                  color="#ff8c00"
                />
                <Text style={styles.buttonText}>Tài khoản và bảo mật</Text>

                {/* điều chỉnh style ở đây bọc icons right trong 1 view rồi flex - end icons sang bên phải */}
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* ------------ */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePressPassword}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="lock-closed-outline"
                  size={30}
                  color="#ff8c00"
                />
                <Text style={styles.buttonText}>Quyền riêng tư</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* -----gạch ngang chia layout ------------ */}
          <View style={styles.divider}></View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Chatpage")}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="message" size={30} color="#ff8c00" />
                <Text style={styles.buttonText}>Tin nhắn</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* ---------------------cuộc gọi------------------------ */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="call" size={30} color="#ff8c00" />
                <Text style={styles.buttonText}>Cuộc gọi</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
              
            </TouchableOpacity>
          </View>
          {/* ------------------danh bạ------------------------ */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Friend")}
            >
              <View style={styles.buttonContent}>
                <AntDesign name="contacts" size={30} color="#ff8c00" />
                <Text style={styles.buttonText}>Danh bạ</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
              
            </TouchableOpacity>
          </View>
          {/* ----------------------------------nhật ký---------------------- */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Time")}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name="access-time" size={30} color="#ff8c00" />
                <Text style={styles.buttonText}>Nhật ký</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            
            </TouchableOpacity>
          </View>
          {/* -----gạch ngang chia layout ------------ */}
          <View style={styles.divider}></View>
          {/* ----------------------------------------- */}
          {/* -----------------------------giao diện và ngôn ngữ------------------- */}
          {/* -------làm thêm phần update chuyển ngôn ngữ và đổi màu giao diện */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <View style={styles.buttonContent}>
                <FontAwesome name="language" size={30} color="#ff8c00" />
                <Text style={styles.buttonText}>Giao diện và ngôn ngữ</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
             
            </TouchableOpacity>
          </View>
          {/* ------------------------------------------------------ */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="information-circle-outline"
                  size={30}
                  color="#ff8c00"
                />
                <Text style={styles.buttonText}>Thông tin về ZenChat</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>

            </TouchableOpacity>
          </View>
          {/* -------------------------------------- */}
          {/* -----gạch ngang chia layout ------------ */}
          <View style={styles.divider}></View>
          {/* ----------------chuyển tài khoản------------------------- */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handledeleaccount}>
              <View style={styles.buttonContent}>
                <MaterialIcons
                  name="manage-accounts"
                  size={30}
                  color="#ff8c00"
                />
                <Text style={styles.buttonText}>Xóa tài khoản</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>

            </TouchableOpacity>
          </View>
          {/* -------------------------button đăng xuất------------------------- */}
          <View style={styles.logoutContainer}>
            <Pressable onPress={handleSignOut} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  imageBackground: {
    width: width,
    height: height * 0.3,
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 20,
  },
  headerTextContainer: {
    marginLeft: 5,
  },
  headerText: {
    fontSize: 18,
    color: "white",
  },
  container: {
    width: "auto",
    height: "auto",
    backgroundColor: "#DCDCDC",
  },
  innerContainer: {
    width: "auto",
    height: "auto",
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginRight: 10,
    marginTop: 20,
    //width: "100%",
    width: width * 1,
    height: 40,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    //justifyContent : "space-between"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "normal",
  },
  divider: {
    borderWidth: 3,
    borderColor: "silver",
    width: width,
    marginTop: 10,
  },
  logoutContainer: {
    //width: "100%",
    width: width * 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    width: 300,
    height: 50,
    backgroundColor: "#D3D3D3",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "bold",
    fontWeight: 700,
  },
});

export default ItemSetting;
