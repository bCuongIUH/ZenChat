import React, { useState, useEffect } from "react";
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
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ItemInfo from "./item-info-user/itemInfo";

export const User = () => {
  const nav = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [filteredTodoList, setFilteredTodoList] = useState([]);

  const [searchStarted, setSearchStarted] = useState(false);

  const handleSearchIconPress = () => {
    setSearchStarted(false);
    setIsSearching(!isSearching);
  };

  const handleAddFriendPress = () => {

    setActionModalVisible(true);
    nav.navigate("ItemSetting");
  };

  const handleCreateChatPress = () => {
    setActionModalVisible(false); 
    nav.navigate("ItemAddFriend");
  };

  const handleModalClose = () => {
    setActionModalVisible(false);
  };

  const handleMainScreenPress = () => {
    setIsSearching(false);
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
            onPress={handleAddFriendPress}
            style={styles.addFriendButton}
          >
            <AntDesign name="setting" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* phần nội dung chính */}
      <View style={styles.content}>
        
        <ItemInfo />
      </View>

      <StatusBar backgroundColor="gray" barStyle="dark-content" />
      <View style={styles.menuView}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Chatpage")}
        >
          <AntDesign name="message1" size={35} color="black" />
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
          <Ionicons name="time-outline" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("User")}
        >
          <FontAwesome
            name="user"
            size={35}
            color="#ff8c00"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  header: {
    //width: "100%",
    width: width * 1,
    height: 80,
    paddingTop: 20,
    backgroundColor: "#ff8c00",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // width: "100%",
    // height: "100%",
    width: width * 1,
    height: height * 1,
  },
  searchBarContainer: {
    position: "absolute",
    height: 50,
    // width: "100%",
    width: width * 1,
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    // height: "80%",
    height: 35,
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
    //height: "25%",
    height: height * 0.25,
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

    height: 30,
    width: width * 0.7,
    backgroundColor: "#ff8c00",
    margin: 5,
  },
  content: {
    flex: 1,
    // width: "100%",
    width: width * 1,
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

export default User;
