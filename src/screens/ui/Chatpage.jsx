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
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { getListRooms, getListGroups, deleteRooms } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import { SocketContext } from "../../untills/context/SocketContext";

// Import ItemGroup component if needed
import ItemGroup from "./item-mess-group/ItemGroup";

export const Chatpage = ({ route }) => {
  const { user } = useContext(AuthContext);
  const nav = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [isFriendActionModalVisible, setFriendActionModalVisible] =
    useState(false);
  const [todoList, setTodoList] = useState([]);
  const [filteredTodoList, setFilteredTodoList] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [addedUsers, setAddedUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const socket = useContext(SocketContext);
  const [isFriend, setIsFriend] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [idGroups, setIdGroups] = useState();
  const [friendCreateGroup, setFriendCreateGroup] = useState([]);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [isChatSingle, setIsChatSingle] = useState(true); // State to manage chat type

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

  const handleCreateChatGroup = () => {
    setActionModalVisible(false);
    nav.navigate("ItemAddGroup");
  };

  const handleModalClose = () => {
    setActionModalVisible(false);
    setFriendActionModalVisible(false);
  };

  const handleMainScreenPress = () => {
    setIsSearching(false);
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
          console.log("lỗi rồi bạn ơii");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (route && route.params && route.params.createdGroup) {
      setCreatedGroup(route.params.createdGroup);
    }
  }, [route]);

  useEffect(() => {
    if (createdGroup) {
      console.log("Thông tin nhóm:", createdGroup);
    }
  }, [createdGroup]);

  useEffect(() => {
    const fetchData = async () => {
      getListGroups()
        .then((res) => {
          setGroups(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log("Đã rơi zô đây");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListGroups();
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchData();
  }, []);
  const getDisplayGroup = (group) => {
    if (!group || !group.creator) {
      return;
    } else {
      return group.creator._id === user?._id ? group.recipient : group.creator;
    }
  };
  
  // const handleGroupPress = (item) => {
  //   // Thực hiện điều hướng sang màn hình mess và truyền thông tin nhóm qua route params
  //   nav.navigate("MessageGroup", {
  //     id: item._id, // ID của nhóm
  //     avatar: item.avtGroups, // Avatar của nhóm
  //     nameRoom: item.nameGroups, // Tên của nhóm
  //     // Các thông tin khác của nhóm có thể truyền tại đây
  //   });
  // };

  const handleGroupPress = (item) => {
    // Thực hiện điều hướng sang màn hình mess và truyền thông tin nhóm qua route params
    nav.navigate("MessageGroup", {
      groupID: item._id, // ID của nhóm
      avatar: item.avtGroups, // Avatar của nhóm
      nameRoom: item.nameGroups,
      nameGroups: item.nameGroups, // Tên của nhóm
      // Các thông tin khác của nhóm có thể truyền tại đây
    });
  };
  
  
  const friend = (userId) => {
    return user.friends.some((friend) => friend._id === userId);
  };

   const handleTodoItemPress = (item) => {
    const existingRoom = rooms.find((room) => {
      return (
        (room.creator._id === user._id && room.recipient._id === item._id) ||
        (room.creator._id === item._id && room.recipient._id === user._id)
      );
    });

    let roomName;
    if (existingRoom) {
      roomName = existingRoom.fullName;
    } else {
      // Tạo tên phòng dựa trên người dùng được chọn và người tạo phòng
      roomName =
        user._id === item._id
          ? `${item.fullName} - ${user.fullName}`
          : `${user.fullName} - ${item.fullName}`;
    }

    if (existingRoom) {
              // console.log(getDisplayUser(existingRoom))
              nav.navigate("Message", {

                id: existingRoom._id,
                friend: existingRoom.friend,
                homemess: existingRoom._id,
                avatar: getDisplayUser(existingRoom).avatar,
                nameRoom: existingRoom.fullName,
                fullName: item.fullName,
                gender: getDisplayUser(existingRoom).gender,
                email: getDisplayUser(existingRoom).email,
                phoneNumber: getDisplayUser(existingRoom).phoneNumber,
                dateOfBirth: getDisplayUser(existingRoom).dateOfBirth,

                //recipient: existingRoom.recipient.sended,
                sender: existingRoom.creator.sended,
                idAccept: getDisplayUser(existingRoom)._id,
                receiver: existingRoom.recipient.sended,
                recipient : getDisplayUser(existingRoom).sended,

                friend: friend(item._id)

              });
              //console.log(existingRoom._id);

              // handleUnfriend(existingRoom)
    }

  };

  socket.on("connected", () => console.log("Connected"));
  socket.on(user?.email, (roomSocket) => {
    setRooms((prevRooms) => [...prevRooms, roomSocket]);
  });

  function handleMoreOptionsPress(user) {
    setSelectedUser(user);
    setIsFriend(friend(user._id));
    setFriendActionModalVisible(true);
  }

  const handleUnfriend = (existingRoom) => {
    // Your code to handle unfriending
  };

  const handleAcceptFriendRequest = (user) => {
    console.log("chấp nhận kết bạn thành công:", user);
  };

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

  useEffect(() => {
    socket.on("connected", () => console.log("Connected"));
    socket.on(user.email, (roomSocket) => {
      setRooms((prevRooms) => [...prevRooms, roomSocket]);
    });
    socket.on(user.email, (roomSocket) => {
      updateListRooms(roomSocket.rooms);
    });

    return () => {
      socket.off("connected");
      socket.off(user.email);
    };
  }, []);

  useEffect(() => {
    socket.on("newRoomCreated", (newRoom) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    });

    return () => {
      socket.off("newRoomCreated");
    };
  }, [socket]);
  const [selectedFunction, setSelectedFunction] = useState("personal");



groups.forEach((group) => {
  console.log('Group ID:', group._id); // Lấy ID của nhóm
  console.log('Group Avatar:', group.avtGroups); // Lấy đường dẫn avatar của nhóm
  console.log('Group Name:', group.nameGroups); // Lấy tên của nhóm
 
});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
        <TouchableOpacity onPress={handleAddFriendPress}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedFunction === "personal" && styles.selectedButton,
          ]}
          onPress={() => setSelectedFunction("personal")}
        >
          <Text style={styles.buttonText}>Chat Đơn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedFunction === "group" && styles.selectedButton,
          ]}
          onPress={() => setSelectedFunction("group")}
        >
          <Text style={styles.buttonText}>Chat Nhóm</Text>
        </TouchableOpacity>
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
              onPress={handleCreateChatGroup}
            >
              <Text style={styles.modalOption}>Tạo Nhóm </Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFriendActionModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalcontent}>
            {isFriend ? (
              <TouchableOpacity
                style={styles.modalbtn}
                onPress={() => handleUnfriend()}
              >
                <Text style={styles.modalOption}>Unfriend</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalbtn}
                onPress={handleAcceptFriendRequest}
              >
                <Text style={styles.modalOption}>Chấp nhận kết bạn</Text>
              </TouchableOpacity>
            )}
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
    data={selectedFunction === "personal" ? rooms : groups}
    renderItem={({ item }) => {
      if (selectedFunction === "group") {
        // Nếu người dùng chọn chat nhóm, chỉ hiển thị danh sách nhóm
        const groupIDs = getDisplayGroup(item);
        return (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleGroupPress(item)}
          >
            <Text style={styles.itemName}>{item.nameGroups}</Text>
            <Text style={styles.itemName}>tên của nhóm</Text>
            {/* <Image source={{ uri: item.avtGroups }} style={styles.groupAvatar} /> */}
            {/* Bổ sung các phần tử khác cần thiết cho mỗi item nhóm */}
          </TouchableOpacity>
        );
      } else {
        // Nếu người dùng chọn chat đơn, chỉ hiển thị danh sách chat đơn
        const displayUser = getDisplayUser(item);
        return (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleTodoItemPress(displayUser)}
          >
            <Image
              source={{ uri: displayUser && displayUser.avatar }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>
                {displayUser && displayUser.fullName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => handleMoreOptionsPress(displayUser)}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }
    }}
    keyExtractor={(item, index) => item._id || index.toString()}
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchBarContainer: {
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
  },
  addFriendButton: {
    marginLeft: 10,
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
    position: "absolute",
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
  selectedButton: {
    color: "#ff8c00",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#ff8c00', // Màu nền được thay đổi khi nút được chọn
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default Chatpage;
