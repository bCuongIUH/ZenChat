import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";

const Time = () => {
  const nav = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleSearchIconPress = () => {
    setIsSearching(!isSearching);
  };
  const handleMainScreenPress = () => {
    setIsSearching(false); // Đóng thanh tìm kiếm khi click vào màn hình chính
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* -------header------- */}
      <TouchableWithoutFeedback onPress={handleMainScreenPress}>
      <View style={styles.fullScreen}>
        <View style={styles.searchBarContainer}>
          {isSearching ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập từ khóa tìm kiếm"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              focusable={false}
            />
          ) : null}
          <TouchableOpacity onPress={handleSearchIconPress}>
            {isSearching ? (
              <Ionicons
                style={styles.searchIcon}
                name="search"
                size={24}
                color="black"
              />
            ) : (
              <Ionicons
                style={styles.searchIcon}
                name="search"
                size={24}
                color="black"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addFriendButton}>
            <Ionicons name="person-add-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>
        </View>
      </TouchableWithoutFeedback>
      {/* ---------------menu bar------------- */}
      <>
        <StatusBar backgroundColor="gray" barStyle="dark-content" />
        <View style={styles.menuView}>
          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("Chatpage")}
          >
            <AntDesign
              name="message1"
              size={35}
              color={
                nav && nav.route && nav.route.name === "Chatpage"
                  ? "#ff8c00"
                  : "black"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("Friend")}
          >
            <FontAwesome
              name="address-book-o"
              size={35}
              color={
                nav && nav.route && nav.route.name === "Friend"
                  ? "#ff8c00"
                  : "black"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("Time")}
          >
            <Ionicons name="time-outline" size={35} color={"#ff8c00"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("User")}
          >
            <FontAwesome
              name="user"
              size={35}
              color={
                nav && nav.route && nav.route.name === "User"
                  ? "#ff8c00"
                  : "black"
              }
            />
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  // header------------------------------
  tabBarButton: {
    flex: 1,
    alignItems: "center",
  },
  fullScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  // searchBarContainer: {
  //   position: "absolute",
  //   bottom: "10%", // Đảm bảo searchBarContainer nằm trên thanh tab bar
  //   height: "12%",
  //   width: "100%",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#ff8c00",
  //   padding: "2%",
  //   paddingTop: "5%",
  // },

  searchInput: {
    flex: 1,
    height: 45,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 15,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 20,
    marginLeft: 10,
  },
  addFriendButton: {
    marginLeft: "auto",
  },
  addFriendIcon: {
    width: 25,
    height: 25,
  },

  // menubarr------------
  menuView: {
    flexDirection: "row",
    position: "fixed", // Sử dụng position: fixed để làm cho thanh tab bar cố định
    bottom: 0,
    left: 0,
    right: 0,
    height: "10%", // Độ cao của thanh tab bar
    backgroundColor: "#fff",
    borderTopWidth: 0.4,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "space-around",
  },

  menubtn: {
    height: 65,
    width: 90,
    borderColor: "#ff8c00",
    backgroundColor: "#ff8c00",
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  menuimg: {
    resizeMode: "contain",
    height: 35,
    width: 35,
    margin: 5,
  },
  mtext: {
    fontWeight: "bold",
    color: "white",
  },
  menubtn1: {
    height: 65,
    width: 100,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  menuimg1: {
    resizeMode: "contain",
    height: 35,
    width: 35,
  },
  mtext1: {
    fontWeight: "bold",
    color: "#ff8c00",
  },

  menubtn: {
    height: 70,
    width: 70,
    //borderColor: "#ff8c00",
    //backgroundColor: "#ff8c00",
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  mtext: {
    fontWeight: "bold",
    color: "white",
  },
  ////////////////////
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  searchBarContainer: {
    //flex: 1,
    position: "absolute",
    height: "12%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    padding: "2%",
    paddingTop: "5%",
  },
  searchInput: {
    flex: 1,
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: "2%",
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: "4%",
    marginLeft: "2%",
  },
  addFriendButton: {
    marginLeft: "auto",
    marginRight: "2%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalcontent: {
    backgroundColor: "gray",
    height: "25%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: "2%",
  },
  modalOption: {
    fontSize: "15px",
    color: "white",
    fontWeight: "bold",
  },
  modalbtn: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: "15%",
    width: "70%",
    backgroundColor: "#ff8c00",
    margin: "1%",
  },
});

export default Time;
