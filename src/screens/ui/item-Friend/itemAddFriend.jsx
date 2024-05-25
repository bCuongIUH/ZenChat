

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { findAuth, createRooms, sendFriends } from "../../../untills/api";
import { useUser } from "../../ui/component/findUser";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { SocketContext } from "../../../untills/context/SocketContext";
import { AuthContext } from "../../../untills/context/AuthContext";

const ItemAddFriend = () => {
  const { user } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { handleFindUser } = useUser();
  const [authFound, setAuthFound] = useState([]);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);
  const [error, setError] = useState(""); 
  const navigation = useNavigation();
  const socket = useContext(SocketContext);
  const formRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const handleSearchChange = (text) => {
    setPhoneNumber(text);
  };

  const handleFoundUser = async () => {
    let data = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      data = `(+84)${phoneNumber.slice(1)}`;
    }
    if (phoneNumber.startsWith("+84")) {
      data = `(+84)${phoneNumber.slice(1)}`;
    }
    const result = await handleFindUser(data);

    if (result !== undefined) {
      setAuthFound([result]);
    }
  };

  const handleAddClick = () => {
    const message = "hello";
    const authen = [authFound[0].email];
    const email = authen[0];
    const data1 = { email, message };

    createRooms(data1)
      .then((res) => {
        if (res.data.message === "Đã tạo phòng với User này ròi") {
          setError("Đã tạo phòng với User này ròi !!!");
          return;
        }
        if (res.data.status === 400) {
          setError("Không thể nhắn tin với chính bản thân mình !!!");
          return;
        } else {
          const idFriend = {
            id: res.data.recipient._id,
          };
          sendFriends(idFriend)
            .then((userRes) => {
              console.log(userRes.data);
              if (userRes.data) {
                if (formRef.current) {
                  formRef.current.style.display = "none";
                }
                setError("Gửi lời mời kết bạn thành công");
                return;
              } else {
                setError("Gửi lời mời kết bạn không thành công");
                return;
              }
            })
            .catch((error) => {
              console.log(error);
              setError("Lỗi hệ thống");
            });
          const roomInfo = res.data.room;
          socket.emit("newRoomCreated", roomInfo);
          navigation.navigate("Chatpage", { roomInfo, user: authFound[0] });
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Lỗi hệ thống");
      });
    setPhoneNumber("");
    setAuthFound([]);
  };

  useEffect(() => {
    console.log(typeof authFound);
  }, [authFound]);

  useEffect(() => {
    socket.on(`updateLastMessages${user.email}`, lastMessageUpdate => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room === undefined || lastMessageUpdate === undefined) {
                    return room;
                }
                if (room._id === lastMessageUpdate._id) {
                    return lastMessageUpdate;
                }
                return room;
            });
        });
    })
    socket.on(`updateLastMessagesed${user.email}`, lastMessageUpdate => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room === undefined || lastMessageUpdate === undefined) {
                    return room;
                }
                if (room._id === lastMessageUpdate._id) {
                    return lastMessageUpdate;
                }
                return room;
            });
        });
    })
    return () => {
        socket.emit("onOffline", { user: user })
        socket.off(`updateLastMessages${user.email}`)
        socket.off(`updateLastMessagesed${user.email}`)
    }
}, [])

useEffect(() => {
    socket.on('connected', () => console.log('Connected'));
    socket.on(`updateSendedFriend${user.email}`, roomsU => {
        if (roomsU) {
            setRooms(prevRooms => {
                return prevRooms.map(room => {
                    if (room._id === roomsU._id) {
                        return roomsU;
                    }
                    return room;
                });
            });  
            updateRoomFriend(roomsU);
        }
    })
    socket.on(`updateAcceptFriendsGroups${user.email}`, data => {
        if (data) {
            setFriendCreateGroup(prevGroups => [...prevGroups, data])
        }
    })
    socket.on(`updateUnFriendsGroups${user.email}`, data => {
        if (data) {
            setFriendCreateGroup(prevGroups => prevGroups.filter(item => item._id !== data.roomsUpdate))
        }
    })
    return () => {
        socket.off('connected');
        socket.off(`updateSendedFriend${user.email}`)
        socket.off(`updateAcceptFriendsGroups${user.email}`)
        socket.off(`updateUnFriendsGroups${user.email}`)
    }
},[])
  
  const handleShowFriendList = () => {
    setShowSearchBar(true); 
    setShowFriendList(true);
  };
 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thêm bạn bè</Text>
      </View>
  
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.fullName}>{user.fullName}</Text>
            <Image source={require('./QR.png')} style={styles.qrCode} />
         
            </View>
        </View>
      </View>
  
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleSearchChange}
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
          />
          <TouchableOpacity onPress={handleFoundUser}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
  
      {authFound.length > 0 && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: authFound[0].avatar }}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.fullName}>{authFound[0].fullName}</Text>
              <Text style={styles.phoneNumber}>
                PhoneNumber: {authFound[0].phoneNumber}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {!isAddClicked ? (
              <TouchableOpacity onPress={handleAddClick}>
                <Text style={styles.addButton}>Thêm bạn</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsAddClicked(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
  
      {showFriendList && (
        <FlatList
          data={friendList}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.fullName}>{item.fullName}</Text>
                <Text style={styles.phoneNumber}>
                  PhoneNumber: {item.phoneNumber}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {/* Thêm phần hiển thị thông báo lỗi */}
      {error !== "" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", 
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height :80
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20, 
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    flex: 1,
    marginRight: 10,
  },
  userInfoContainer: {
    marginTop: 90,
    alignItems: "center", // Canh chỉnh nội dung vào giữa
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userDetails: {
    flexDirection: "column", 
    alignItems: "center",
    marginLeft: 10,
    marginTop: 20, 
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qrCodeContainer: {
    width: 100, 
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, 
  },
  qrCode: {
    width: 90, 
    height: 90,
  },
});

export default ItemAddFriend;
