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
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          {isSearching ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập từ khóa tìm kiếm"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={(text) => {
                setSearchStarted(true);
                setSearchText(text);
              }}
              focusable={false}
            />
          ) : null}
          <TouchableOpacity onPress={handleSearchIconPress}>
            {isSearching ? (
              <AntDesign name="closecircleo" size={24} color="black" />
            ) : (
              <Ionicons
                style={styles.searchIcon}
                name="search"
                size={24}
                color="black"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            //onPress={handleAddFriendPress}
            style={styles.addFriendButton}
          >
            <Ionicons name="person-add-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
     
      <View style={styles.content}>
            <Text>center</Text>

      </View>
   
      <StatusBar backgroundColor="gray" barStyle="dark-content" />
      <View style={styles.menuView}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Chatpage")}
        >
          <AntDesign name="message1" size={35} color="#black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Friend")}
        >
          <FontAwesome name="address-book-o" size={35} color="black" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 80,
    paddingTop: 20,
    backgroundColor: "#ff8c00",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  searchBarContainer: {
    position: "absolute",
    height: 50,
    width: "100%",
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 10,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  addFriendButton: {
    marginLeft: "auto",
    marginRight: 10,
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
    padding: 10,
  },
  modalOption: {
    fontSize: 15,
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
    margin: 5,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemStatus: {
    fontSize: 14,
    color: "gray",
  },
  menuView: {
    flexDirection: "row",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#fff",
    borderTopWidth: 0.4,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
  },
});

export default Time;
