// import React, { useState, useContext, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
// } from "react-native";
// import {
//   getRoomsMessages,
//   createMessage,
//   deleteMessages,
//   updateMessage,
// } from "../../../untills/api";
// import { SocketContext } from "../../../untills/context/SocketContext";
// import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
// import { useRoute } from "@react-navigation/native";
// import { AuthContext } from "../../../untills/context/AuthContext";
// import { useNavigation } from "@react-navigation/native";

// export const Message = ({ route }) => {
//   const { id, nameRoom, avatar, updateLastMessage, fullName, isFriend } =
//     route.params;
//   const [messages, setMessages] = useState([]);
//   const socket = useContext(SocketContext);
//   const [texting, setTexting] = useState("");
//   const messRef = useRef();
//   const { user } = useContext(AuthContext);
//   const nav = useNavigation();

//   useEffect(() => {
//     const RoomMessages = {
//       roomsId: id,
//     };
//     getRoomsMessages(RoomMessages)
//       .then((data) => {
//         setMessages(data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [id]);

//   useEffect(() => {
//     socket.on("connected", () => console.log("Connected"));
//     socket.on(id, (messagesSocket) => {
//       setMessages((prevMessages) => [...prevMessages, messagesSocket.message]);
//     });
//     return () => {
//       socket.off("connected");
//       socket.off(id);
//     };
//   }, [id, socket]);

//   const ScrollbarCuoi = () => {
//     const scroll = messRef.current;
//     if (scroll) {
//       scroll.scrollToEnd();
//     }
//   };

//   useEffect(() => {
//     ScrollbarCuoi();
//   }, [id, updateLastMessage]);

//   const handleTexting = (text) => {
//     setTexting(text);
//   };

//   const handleSendMess = () => {
//     if (texting === "") {
//       alert("Mời bạn nhập tin nhắn");
//       return;
//     } else if (!id) {
//       alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
//       return;
//     } else {
//       const data = {
//         content: texting,
//         roomsID: id,
//       };
//       createMessage(data)
//         .then((res) => {
//           setTexting(""); // Xóa nội dung đã nhập sau khi gửi tin nhắn thành công
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };

//   const scrollToEnd = () => {
//     const scroll = messRef.current;
//     if (scroll) {
//       scroll.scrollToEnd({ animated: true });
//     }
//   };

//   useEffect(() => {
//     scrollToEnd();
//   }, [messages]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => nav.goBack()}>
//           <View style={styles.goBackContainer}>
//             <AntDesign name="arrowleft" size={24} color="black" />
//             <Text style={styles.goBackText}>{fullName}</Text>
//             {isFriend ? (
//               <Text style={styles.strangerFriendStatus}>Bạn bè</Text>
//             ) : (
//               <Text style={styles.strangerFriendStatus}>Người lạ</Text>
//             )}
//           </View>
//         </TouchableOpacity>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.headerButton}>
//             <Ionicons name="call" size={24} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerButton}>
//             <FontAwesome name="video-camera" size={24} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerButton}>
//             <Entypo name="menu" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <ScrollView ref={messRef} style={styles.messageContent}>
//         <View style={styles.messageContainer}>
//           {messages.map((message, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.message,
//                 message.author.email === user.email
//                   ? styles.messageAuthor
//                   : styles.messageReceiver,
//               ]}
//             >
//               {message.author.email !== user.email && (
//                 <View style={styles.avatarContainer}>
//                   <Image
//                     source={{ uri: message.author.avatar }}
//                     style={styles.avatar}
//                   />
//                 </View>
//               )}
//               <View style={styles.messageTextContainer}>
//                 <Text style={styles.messageText}>{message.content}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       <View style={styles.inputSection}>
//         <TextInput
//           style={styles.input}
//           placeholder="Tin nhắn..."
//           value={texting}
//           onChangeText={handleTexting}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSendMess}>
//           <Ionicons name="send" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     backgroundColor: "#ff8c00",
//   },
//   headerRight: {
//     flexDirection: "row",
//   },
//   headerButton: {
//     marginLeft: 5,
//     marginRight: 10,
//   },
//   goBackContainer: {
//     flexDirection: "column", // Change flexDirection to column
//     alignItems: "flex-start", // Align items to the start
//   },
//   goBackText: {
//     marginLeft: 30,
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "black",
//   },
//   friendStatus: {
//     marginLeft: 10,
//     color: "green",
//   },
//   strangerStatus: {
//     marginLeft: 10,
//     color: "red",
//   },
//   messageContent: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   messageContainer: {
//     flexGrow: 1,
//     justifyContent: "flex-end",
//   },
//   message: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     maxWidth: "80%",
//   },
//   avatarContainer: {
//     marginRight: 10,
//     marginLeft: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   messageTextContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   messageAuthor: {
//     alignSelf: "flex-end",
//     backgroundColor: "#ffa500",
//   },
//   messageReceiver: {
//     alignSelf: "flex-start",
//     backgroundColor: "silver",
//   },
//   inputSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#ff8c00",
//     padding: 10,
//     borderRadius: 5,
//   },
//   strangerFriendStatus: {
//     color: "black", // Set color to black
//     fontWeight: "bold", // Set font weight to bold
//     marginTop: 5, // Add margin to separate it from the full name
//     marginLeft :30
//   },
// });

// export default Message;
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import {
  getRoomsMessages,
  createMessage,
  deleteMessages,
  updateMessage,
} from "../../../untills/api";
import { SocketContext } from "../../../untills/context/SocketContext";
import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export const Message = ({ route }) => {
  const { id, nameRoom, avatar, updateLastMessage, fullName, isFriend } =
    route.params;
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [texting, setTexting] = useState("");
  const messRef = useRef();
  const { user } = useContext(AuthContext);
  const nav = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getRoomsMessages({ roomsId: id });
        setMessages(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [id]);

  useEffect(() => {
    const handleSocketEvents = () => {
      socket.on("connected", () => console.log("Connected"));
      socket.on(id, (messagesSocket) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          messagesSocket.message,
        ]);
      });
    };

    handleSocketEvents();

    return () => {
      socket.off("connected");
      socket.off(id);
    };
  }, [id, socket]);

  const scrollToBottom = () => {
    if (messRef.current) {
      messRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTexting = (text) => {
    setTexting(text);
  };

  const handleSendMess = () => {
    if (texting.trim() === "") {
      Alert.alert("Mời bạn nhập tin nhắn");
      return;
    }

    if (!id) {
      Alert.alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
      return;
    }

    const data = {
      content: texting,
      roomsID: id,
    };

    createMessage(data)
      .then(() => {
        setTexting("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    // Xử lý khi nhấn nút gửi lời mời kết bạn
    setRequestSent(true);
    // Các xử lý khác có thể ở đây
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={styles.goBackButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.fullName}>{fullName}</Text>
          {isFriend ? (
            <Text style={[styles.friendStatus, styles.italic]}>Bạn bè</Text>
          ) : (
            <Text style={[styles.strangerStatus, styles.italic]}>Người lạ</Text>
          )}
        </View>
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

      {isFriend ? null : (
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={handleSendRequest}
          disabled={requestSent}
        >
          <Text style={styles.inviteButtonText}>
            {requestSent ? "Đã yêu cầu kết bạn" : "Gửi lời mời kết bạn"}
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView ref={messRef} style={styles.messageContent}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.author.email === user.email
                ? styles.messageAuthor
                : styles.messageReceiver,
            ]}
          >
            {message.author.email !== user.email && (
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: message.author.avatar }}
                  style={styles.avatar}
                />
              </View>
            )}
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageText}>{message.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Tin nhắn..."
          value={texting}
          onChangeText={handleTexting}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
          <Ionicons name="send" size={24} color="white" />
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
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ff8c00",
    height: 80, // Chiều cao của thanh header
  },
  goBackButton: {
    marginRight: 10, // Khoảng cách giữa nút quay lại và nội dung header
  },
  headerContent: {
    flexDirection: "column", // Thay đổi thành column
    alignItems: "flex-start", // Đảm bảo căn trái cho nội dung
    flex: 1, // Chia phần còn lại của header
  },
  headerRight: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 5,
    marginRight: 10,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  friendStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    fontStyle: "italic",
  },
  strangerStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    fontStyle: "italic",
  },
  italic: {
    fontStyle: "italic",
  },
  messageContent: {
    flex: 1,
  },
  messageContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  message: {
    flexDirection: "row",
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageAuthor: {
    alignSelf: "flex-end",
    backgroundColor: "#ffa500",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: "auto",
  },
  messageReceiver: {
    alignSelf: "flex-start",
    backgroundColor: "silver",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: "auto",
  },
  avatarContainer: {
    marginRight: 10,
    alignSelf: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  messageText: {
    color: "#fff",
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
  inviteButton: {
    backgroundColor: "#ff8c00",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  inviteButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default Message;
