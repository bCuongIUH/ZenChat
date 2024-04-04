import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { findAuth, createRooms } from "../../../untills/api";
import { useUser } from "../../ui/component/findUser";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { SocketContext } from "../../../untills/context/SocketContext";
import { AuthContext } from "../../../untills/context/AuthContext";
const ItemAddFriend = () => {
  const { user } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authFound, setAuthFound] = useState(null);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const navigation = useNavigation();
  const socket = useContext(SocketContext);
  const handleSearchChange = (text) => {
    setPhoneNumber(text);
  };

  const handleFoundUser = async () => {
    try {
      const data = { phoneNumber };
      const result = await findAuth(data);
      setAuthFound(result);
    } catch (error) {
      console.error("Error finding user:", error);
    }
  };

  useEffect(() => {
    console.log(typeof authFound);
  }, [authFound]);

  const handleAddClick = () => {
    if (!authFound) {
      console.error("No user found to add");
      return;
    }

    const message = "hello";
    const email = authFound.email;
    const data1 = { email, message };

    createRooms(data1)
      .then((res) => {
        if (res.data.message === "Đã tạo phòng với User này ròi") {
          alert("Đã tạo phòng với User này rồi!!!"); //trc đó có add room
          return;
        }
        if (res.data.status === 400) {
          alert("Không thể nhắn tin với chính bản thân mình!!!"); //
          return;
        } else {
          // Xử lý sau khi tạo phòng thành công
          // formRef.current.style.display = "none";
          const roomInfo = res.data.room; // Thông tin về phòng mới tạo
          socket.emit("newRoomCreated", roomInfo);
          navigation.navigate("Chatpage");
        } 
      })
      .catch((err) => {
        alert("Lỗi hệ thống");
      });
  };
  const updateLastMessage = (updatedRoom) => {
    setRooms((prevRooms) => {
      // Cập nhật phòng đã được cập nhật
      return prevRooms.map((room) => {
        if (room === undefined || updatedRoom === undefined) {
          return room;
        }
        if (room._id === updatedRoom._id) {
          return updatedRoom;
        }
        return room;
      });
    });
  };

  //lấy id của room///////////////////////////////////////////////////////////////////////rooms
  const updateListRooms = (updatedRoom) => {
    setRooms((prevRooms) => {
      // Cập nhật phòng đã được cập nhật
      return prevRooms.map((room) => {
        if (room === undefined || updatedRoom === undefined) {
          return room;
        }
        if (room._id === updatedRoom._id) {
          return updatedRoom;
        }
        return room;
      });
    });
  };
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
      socket.off(user.email);
    };
  }, []);
  useEffect(() => {
    socket.on(`updateLastMessages${user.email}`, (lastMessageUpdate) => {
      setRooms((prevRooms) => {
        // Cập nhật phòng đã được cập nhật
        return prevRooms.map((room) => {
          if (room === undefined || lastMessageUpdate === undefined) {
            return room;
          }
          if (room._id === lastMessageUpdate._id) {
            return lastMessageUpdate;
          }
          return room;
        });
      });
    });
    socket.on(`updateLastMessagesed${user.email}`, (lastMessageUpdate) => {
      setRooms((prevRooms) => {
        // Cập nhật phòng đã được cập nhật
        return prevRooms.map((room) => {
          if (room === undefined || lastMessageUpdate === undefined) {
            return room;
          }
          if (room._id === lastMessageUpdate._id) {
            return lastMessageUpdate;
          }
          return room;
        });
      });
    });
    return () => {
      socket.off(`updateLastMessages${user.email}`);
      socket.off(`updateLastMessagesed${user.email}`);
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SignUp</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={handleSearchChange}
        placeholder="Nhập số điện thoại"
        value={phoneNumber}
      />
      <Button title="Tìm kiếm" onPress={handleFoundUser} />

      {authFound && (
        <View key={authFound._id} style={styles.showAdd}>
          <View style={styles.userInfo}>
            <Image source={{ uri: authFound.avatar }} style={styles.avatar} />
            <Text style={styles.fullName}>{authFound.fullName}</Text>
            <Text style={styles.phoneNumber}>
              PhoneNumber: {authFound.phoneNumber}
            </Text>
          </View>
          <TouchableOpacity onPress={handleAddClick}>
            <Text
              style={[
                styles.addButton,
                {
                  backgroundColor: isAddClicked
                    ? "rgb(204, 82, 30)"
                    : "rgb(204, 82, 30)",
                },
              ]}
            >
              {isAddClicked ? "Undo" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nút Add */}
      {authFound && !isAddClicked && (
        <TouchableOpacity onPress={handleAddClick}>
          <Text style={styles.addButton}>Thêm bạn</Text>
        </TouchableOpacity>
      )}

      {/* Nút Cancel */}
      {authFound && isAddClicked && (
        <TouchableOpacity onPress={() => setIsAddClicked(false)}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: "white",
  },
  userInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
    marginBottom: 10,
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
  },
});

export default ItemAddFriend;
