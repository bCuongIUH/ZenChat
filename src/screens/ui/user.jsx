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
  TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';

const User = () => {
  const nav = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchIconPress = () => {
    setIsSearching(!isSearching);
  };

  const handleMainScreenPress = () => {
    setIsSearching(false); // Đóng thanh tìm kiếm khi click vào màn hình chính
  };

  const user = {
    imageUrl: 'https://res.cloudinary.com/dhpqoqtgx/image/upload/v1709272691/ywgngx6l24nrwylcp2ta.jpg',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* -------header------- */}
      <TouchableWithoutFeedback onPress={handleMainScreenPress}>
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
              <Ionicons style={styles.searchIcon} name="search" size={24} color="black" />
            ) : (
              <Ionicons style={styles.searchIcon} name="search" size={24} color="black" />
            )}
          </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity style={styles.addFriendButton}>
            <AntDesign name="setting" size={24} color="black" />
          </TouchableOpacity>
     

      {/* ------------------------------------------------------Body---------------------------------------------------- */}
      <View style={styles.body}>
        <View>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        </View>

        <TouchableOpacity
          onPress={() => nav.navigate('Info')}
          style={styles.option}>
          <Text style={styles.optiontext}>Thông Tin Cá Nhân</Text>
        </TouchableOpacity>
      </View>
      {/* ------------------------------------------------------Body---------------------------------------------------- */}

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
              color={nav && nav.route && nav.route.name === "Chatpage" ? "#ff8c00" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("Friend")}
          >
            <FontAwesome
              name="address-book-o"
              size={35}
              color={nav && nav.route && nav.route.name === "Friend" ? "#ff8c00" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("Time")}
          >
            <Ionicons
              name="time-outline"
              size={35}
              color={nav && nav.route && nav.route.name === "Time" ? "#ff8c00" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabBarButton}
            onPress={() => nav.navigate("User")}
          >
            <FontAwesome
              name="user"
              size={35}
              color={"#ff8c00"}
            />
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  // ------------------------------------header------------------------------------------------------------------
  tabBarButton: {
    flex: 1,
    alignItems: "center",
  },
  addFriendButton: {
    marginLeft: "auto",
  },
  addFriendIcon: {
    width: 25,
    height: 25,
  },
  fullScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  //------------------------------------body------------------------------------
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "contain",
  },
  option: {
    width: "100%",
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    margin: 2,
  },

  //------------------------------------ menubarr------------------------------------------------
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

});

export default User;
