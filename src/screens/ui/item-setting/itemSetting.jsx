import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  TouchableOpacity,
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
import { logoutUser, removeCookie } from "../../../untills/api";

const ItemSetting = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const handleSignOut = () => {
    logoutUser({})
      .then((res) => {
        removeCookie();
        //window.location.href = "Login";
        navigation.navigate("Login")
      })
      .catch((err) => {
        console.log("lỗi");
      });
  };
  const handlePress = () => {
    // Xử lý sự kiện khi button được nhấn
    navigation.navigate("ItemSecurity");
  };

  return (
    <ScrollView style={{flex:1}}>
      <ImageBackground
        style={{ width: 500, height: 200 }}
        source={{ uri: user.avatar }}
      >
        <View>
          <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 20 }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
            <View style={{ marginLeft: 5 }}>
              <Text style={{ fontSize: 18, color: "white" }}>Cài đặt</Text>
            </View>
            {/* <Image
              source={{
                uri: "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1709272691/ywgngx6l24nrwylcp2ta.jpg",
              }}
              style={{ width: 30, height: 30, marginLeft: 250 }}
            ></Image> */}
          </View>
        </View>
      </ImageBackground>

      <View style={{ width: "auto", height: "auto", backgroundColor: "#DCDCDC" }}>
        <View style={{ width: "auto", height: "auto", backgroundColor: "white" }}>
          {/* center các button trong setting */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <MaterialCommunityIcons
                    name="security"
                    size={30}
                    color="#ff8c00"
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Tài khoản và bảo mật
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* ------------ */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={30}
                    color="#ff8c00"
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Quyền riêng tư
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* -----gạch ngang chia layout ------------ */}
          <View
            style={{
              borderWidth: 3,
              borderColor: "silver",
              width: 420,
              marginTop: 10,
            }}
          ></View>
          {/* ----------------------------------------- */}
          {/* -----Dung lượng và dữ liệu------- */}
          {/* <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 10,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <Entypo name="time-slot" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Dung lượng và dữ liệu
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* -----------------sao lưu và khôi phục---------------- */}

          {/* <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <Fontisto name="cloud-refresh" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Sao lưu và khôi phục
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* -----gạch ngang chia layout ------------ */}
          {/* <View
            style={{
              borderWidth: 3,
              borderColor: "silver",
              width: 420,
              marginTop: 10,
            }}
          ></View> */} 
          {/* ----------------------------------------- */}
          {/* ------------------------------------------------------------------------- */}
          {/* ---tin nhắn---- */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={() => navigation.navigate("Chatpage")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <MaterialIcons name="message" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Tin nhắn
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* ---------------------cuộc gọi------------------------ */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <MaterialIcons name="call" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Cuộc gọi
                </Text>
                <View
                  style={{ flex: 1,alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* ------------------danh bạ------------------------ */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={() => navigation.navigate("Friend")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <AntDesign name="contacts" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>Danh bạ</Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* ----------------------------------nhật ký---------------------- */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={() => navigation.navigate("Time")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <MaterialIcons name="access-time" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>Nhật ký</Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* -----gạch ngang chia layout ------------ */}
          <View
            style={{
              borderWidth: 3,
              borderColor: "silver",
              width: 420,
              marginTop: 10,
            }}
          ></View>
          {/* ----------------------------------------- */}
          {/* -----------------------------giao diện và ngôn ngữ------------------- */}
          {/* -------làm thêm phần update chuyển ngôn ngữ và đổi màu giao diện */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <FontAwesome name="language" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Giao diện và ngôn ngữ
                </Text>
                <View
                  style={{ flex: 1,alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* ------------------------------------------------------ */}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={30}
                    color="#ff8c00"
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Thông tin về ZenChat
                </Text>
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
          <View
            style={{
              borderWidth: 3,
              borderColor: "silver",
              width: 420,
              marginTop: 10,
            }}
          ></View>
          {/* ----------------chuyển tài khoản------------------------- */}
       
            <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 20,
                width: "100%", // Đặt chiều rộng là 80% của màn hình
                height: 40, // Đặt độ cao là 20px
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCDCDC",
                }}
              >
                <View style={{ marginRight: 20 }}>
                <MaterialIcons name="manage-accounts" size={30} color="#ff8c00" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  Chuyển tài khỏa
                </Text>
                <View
                  style={{ flex: 1,  alignItems: "flex-end" }}
                >
                  <AntDesign name="right" size={18} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* -------------------------button đăng xuất------------------------- */}
          <View
            style={{
              width :"100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={handleSignOut}
              style={{
                width: 300,
                height: 50,
                backgroundColor: "#D3D3D3",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                flexDirection: "row",
                marginLeft:30,
                marginRight:30
              }}
            >
              <View>
                <Ionicons name="log-out-outline" size={24} color="black" />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  fontWeight: 700,
                  //marginLeft: 10,
                }}
              >
                Đăng xuất
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default ItemSetting;
