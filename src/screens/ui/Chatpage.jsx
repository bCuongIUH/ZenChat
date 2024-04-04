import React, { useState, useEffect, useContext } from "react";
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
import { getListRooms } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";

export const Chatpage = ({ route }) => {
  const { user } = useContext(AuthContext);
  
  const nav = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [filteredTodoList, setFilteredTodoList] = useState([]);

  const [searchStarted, setSearchStarted] = useState(false);

  const [addedUsers, setAddedUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const handleSearchIconPress = () => {
    setSearchStarted(false);
    setIsSearching(!isSearching);
  };

  const handleAddFriendPress = () => {
    setActionModalVisible(true);
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
  const handleTodoItemPress = (item) => {
    nav.navigate("Message", { item });
  };

  const getDisplayUser = (room) => {
    if (!room || !room.creator) {
      return;
    } else {
      return room.creator._id === user?._id ? room.recipient : room.creator;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getListRooms()
        .then((res) => {
          setRooms(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log("Error occurred while fetching data");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchStarted || searchText === "") {
      if (searchText === "") {
        setFilteredTodoList(todoList);
      } else {
        const filteredList = todoList.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTodoList(filteredList);
      }
    }
  }, [searchStarted, searchText, todoList]);

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
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isActionModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalcontent}>
            <TouchableOpacity
              style={styles.modalbtn}
              onPress={handleCreateChatPress}
            >
              <Text style={styles.modalOption}>Tạo cuộc trò chuyện mới</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalbtn}
              onPress={handleModalClose}
            >
              <Text style={styles.modalOption}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <FlatList
          data={rooms}
          renderItem={({ item }) => {
            const displayUser = getDisplayUser(item);
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleTodoItemPress(item)}
              >
                <Image
                  source={{ uri: displayUser.avatar }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{displayUser.fullName}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <StatusBar backgroundColor="gray" barStyle="dark-content" />
      <View style={styles.menuView}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Chatpage")}
        >
          <AntDesign name="message1" size={35} color="#ff8c00" />
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
          <Ionicons
            name="time-outline"
            size={35}
            color={
              nav && nav.route && nav.route.name === "Time"
                ? "#ff8c00"
                : "black"
            }
          />
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
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  header: {
    width: width * 1,
    height: 80,
    paddingTop: 20,
    backgroundColor: "#ff8c00",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: width * 1,
    height: height * 1,
  },
  searchBarContainer: {
    position: "absolute",
    height: 50,
    width: width * 1,
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flex: 1,
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
    borderRadius: 90,
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

export default Chatpage;
