import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getRoomsMessages, createMessage } from "../../../untills/api";
import { SocketContext } from "../../../untills/context/SocketContext";
import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";

export const Message = ({ id, navigation }) => {
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [texting, setTexting] = useState("");
  const messRef = useRef();
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const selectedRoom = route.params ? route.params.item : {};


  const getDisplayUser = (room) => {
    if (!room || !room.creator) {
      return;
    } else {
      return room.creator._id === user?._id ? room.recipient : room.creator;
    }
  };

  const selectedUser = getDisplayUser(selectedRoom);
  useEffect(() => {
    const RoomMessages = {
      roomsId: id
    };
    getRoomsMessages(RoomMessages)
      .then((data) => {
        setMessages(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  
  useEffect(() => {
    const RoomMessages = {
      roomsId: id,
    };
    getRoomsMessages(RoomMessages)
      .then((data) => {
        setMessages(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    socket.on("connected", () => console.log("Connected"));
    socket.on(id, (messagesSocket) => {
      setMessages((prevMessages) => [...prevMessages, messagesSocket.message]);
    });
    return () => {
      socket.off("connected");
      socket.off(id);
    };
  }, [id, socket]);

  const ScrollbarCuoi = () => {
    const scroll = messRef.current;
    if (scroll) {
      scroll.scrollToEnd();
    }
  };

  useEffect(() => {
    ScrollbarCuoi();
  }, [id]);

  // const handleSendMess = () => {
  //   if (texting === "") {
  //     Alert.alert("Mời bạn nhập tin nhắn");
  //     return;
  //   }

  //   socket.emit("sendMessage", { content: texting });
  //   setTexting("");
  // };
  const handleSendMess = () => {
    if (texting === "") {
      alert("Mời bạn nhập tin nhắn");
      return;
    } else if (!id) {
      alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
      return;
    } else {
      const data = {
        content: texting,
        roomsID: id,
      };
      createMessage(data)
        .then((res) => {
          setTexting("");
          // console.log(res.data.rooms)
          socket.emit("sendMessage", { content: texting });
          setTexting("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.goBackContainer}>
            <AntDesign name="arrowleft" size={24} color="black" />
            <Text style={styles.goBackText}>{selectedUser.fullName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesome name="video-camera" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Entypo name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={messRef} style={styles.messageContent}>
        {messages.map((message, index) => (
          <View key={index} style={styles.message}>
            <Text>{message.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Tin nhắn..."
          value={texting}
          onChangeText={setTexting}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMess}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="document" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#ff8c00",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 5,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
    padding: 10,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#ff8c00",
    padding: 10,
    borderRadius: 5,
  },
  attachButton: {
    marginLeft: 10,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  goBackText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default Message;
