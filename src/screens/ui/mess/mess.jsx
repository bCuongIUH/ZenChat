import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, Platform ,Linking } from "react-native";
import { getRoomsMessages, createMessage, acceptFriends, createMessagesFile, deleteMessages } from "../../../untills/api";
import { SocketContext } from "../../../untills/context/SocketContext";
import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FilePicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { KeyboardAvoidingView } from 'react-native';

export const Message = ({ route }) => {
  const {
    id,
    fullName,
    friend,
    receiver,
    sender,
    recipient,
    idAccept,
  } = route.params;
  console.log(friend,
    receiver,
    sender,
    recipient,
    idAccept,)
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [texting, setTexting] = useState("");
  const messRef = useRef();
  const { user } = useContext(AuthContext);
  const nav = useNavigation();
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [displayMode, setDisplayMode] = useState("none");
  const [areFriends, setAreFriends] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [sendFile, setSendFile] = useState([]);
  const [sendImage, setSendImage] = useState([]);
  const fileInputRef = useRef();
  const [clickedMessage, setClickedMessage] = useState(null);
  const [files, setFiles] = useState([])

useEffect(() => {
  const RoomMessages = {
      roomsId: id
  }
  getRoomsMessages(RoomMessages)
      .then((data) => {
          setMessages(data.data);
      })
      .catch((err) => {
          console.log(err);
      })
}, [id])

useEffect(() => {
  socket.on("connected", () => console.log("Connected"));
  socket.on(`createMessage${id}`, messagesSocket => {
    setMessages(prevMessages => [...prevMessages, messagesSocket.message]);
    // updateLastMessage(messagesSocket.rooms)
  });
  socket.on(`deleteMessage${id}`, (data) => {
    if (data) {
      // Loại bỏ tin nhắn bằng cách filter, không cần gói trong mảng mới
      setMessages(prevMessages => prevMessages.filter(item => item._id !== data.idMessages));
      // Sử dụng concat hoặc spread operator để thêm messages mới vào
      setMessages(prevMessages => [...prevMessages, ...data.roomsUpdate.messages]);
    }
  });
  socket.on(`updatedMessage${id}`, data => {
    if (data) {
      setMessages(data.messagesCN);
      //updateLastMessage(data.dataLoading.roomsUpdate)
    }
  });
  socket.on(`acceptFriends${id}`, data => {
    if (data) {
      setAreFriends(true);
      setDisplayMode('friend');
      //updateRoomFriend(data)
    }
  });

  return () => {
    socket.off('connected');
    socket.off(`createMessage${id}`);
    socket.off(`deleteMessage${id}`);
    socket.off(`updatedMessage${id}`);
    socket.off(`acceptFriends${id}`);
  };
}, [id, socket]);
//
const updateLastMessage = (updatedRoom) => {
  setRooms(prevRooms => {
      // Cập nhật phòng đã được cập nhật
      return prevRooms.map(room => {
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
//
console.log('====================================');
console.log("tin nhắn dc gửi:",messages);
console.log('====================================');
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

  // /////////
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

  const handleFileButtonPress = async () => {

  };
  const onPickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.type !== "cancel") {
        const fileData = {
          uri: file.uri,
          type: file.type,
          name: file.name,
        };
        setSendFile([{ file: fileData }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const image = {
          uri: result.uri,
          type: "image/jpeg",
          name: result.uri.split("/").pop(),
        };
        setSendImage([{ file: image }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOpenFilePicker = () => {
    fileInputRef.current.click();
  };

  const onFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileData = {
        uri: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      };
      setSendFile([{ file: fileData }]);
    }
  };

  const onImageInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = {
          uri: e.target.result,
          type: file.type,
          name: file.name,
        };
        setSendImage([{ file: image }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMess = () => {
    if (texting === '') {
      Alert.alert("Please enter a message");
      return;
    } else if (!id) {
      Alert.alert("Không thể tìm thấy phòng bạn muốn gửi tin nhắn");
      return;
    } else {
      setIsActive(true);
      if (sendFile.length > 0) {
        const formData = new FormData();
        formData.append('file', sendFile[0].file);

        createMessagesFile(formData)
          .then((resFile) => {
            const data1 = {
              content: resFile.data,
              roomsID: id,
            };

            createMessage(data1)
              .then((res) => {
                setTexting("");
                setSendFile([]);
                if (res.data.status === 400) {
                  Alert.alert("Bạn và người này không còn là bạn nên không thể nhắn tin cho nhau");
                }
                setTimeout(() => {
                  setIsActive(false);
                }, 300);
              })
              .catch((err) => {
                if (err.status === 400) {
                  Alert.alert("Server error");
                }
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (sendImage.length > 0) {
        const formData1 = new FormData();
        formData1.append('file', sendImage[0].file);

        createMessagesFile(formData1)
          .then((resFile) => {

            const data2 = {
              content: resFile.data,
              roomsID: id,
            };
            createMessage(data2)
              .then((res) => {
                setTexting("");
                setSendImage([]);
                if (res.data.status === 400) {
                  Alert.alert("You and this person are no longer friends so you cannot message each other");

                }
                setTimeout(() => {
                  setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                }, 300);
                console.log("tin nhắn dc gửi thành công",res.data);

              })
              .catch((err) => {
                if (err.status === 400) {
                  Alert.alert("Server error");

                }

              })
          })
          .catch((err) => {
            console.log(err);
          })
      }
      else {
        const data = {
          content: texting,
          roomsID: id,
        };
        createMessage(data)
          .then((res) => {
            setTexting("");
            if (res.data.status === 400) {
              Alert.alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")

            }
            setTimeout(() => {
              setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
            }, 300);
            //console.log(res.data);
          })
          .catch((err) => {
            if (err.status === 400) {
              Alert.alert("Lỗi Server")

            }

          })
      }
    }
  };

let settime = null;

useEffect(() => {

    clearTimeout(settime);

}, [texting]);
useEffect(() => {
  let timer;
  if (clickedMessage) {
      timer = setTimeout(() => {
          setClickedMessage(null);
      }, 3000);
  }
  return () => clearTimeout(timer);
}, [clickedMessage]);
const SendToMesageImage = (mm) => {
  if (mm.endsWith('.jpg') || mm.endsWith('.png') || mm.endsWith('.jpeg') || mm.endsWith('.gif') || mm.endsWith('.tiff') || mm.endsWith('.jpe') || mm.endsWith('.jxr') || mm.endsWith('.tif') || mm.endsWith('.bmp')) {
      return <Image source={{ uri: mm }} style={{ width: 150, height: 150 }} />;
  }
  else if (mm.endsWith('.docx')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' }} style={{ width: 80, height: 80 }} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.pdf')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' }} style={{ width: 80, height: 80 }} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.rar')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' }} style={{ width: 80, height: 80}} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.mp4')) {
      return <Video source={{ uri: mm }} style={{ width: 300, height: 300 }} />;
  }
  else {
      return <Text>{mm}</Text>;
  }
}

  const [requestSent, setRequestSent] = useState(false);

  const handleEditMessage = () => {

    setShowOptions(false); // Đóng options sau khi thực hiện hành động
  };

  const handleDeleteMessage = () => {
    // Xử lý khi nhấn nút xóa tin nhắn
    // Ví dụ:
    const idLastMess = messages.slice(-1)[0]
    const dataDeleteMessages = {
      idMessages: messages[selectedMessageIndex]._id,
      idLastMessageSent: idLastMess._id,
      email: user.email
    }
    deleteMessages(id, dataDeleteMessages)
      .then((res) => {
        if (res.data.response === "Bạn không phải là chủ tin nhắn") {
          alert("Bạn không phải chủ tin nhắn nên không thể xóa")
        }
        if (res.status !== 200) {
          alert("Không thể xóa được tin nhắn")
          return;
        }
      })
      .catch((err) => {
        alert("Lỗi hệ thống")
      });
    setShowOptions(false); // Đóng options sau khi thực hiện hành động
  };

  const handleShowOptions = (index) => {
    // Nếu đã mở rồi thì đóng lại
    if (selectedMessageIndex === index && showOptions) {
      setShowOptions(false);
      setSelectedMessageIndex(null); // Đặt lại selectedMessageIndex về null
    } else {
      setSelectedMessageIndex(index);
      setShowOptions(true);
    }
  };

    useEffect(() => {
      // Kiểm tra xem cả hai đều là bạn bè hay không
      if (friend === false) {
        setAreFriends(false);
      } else {
        setAreFriends(true);
      }
    }, [friend]);

    useEffect(() => {
      console.log(friend);
      // Xác định trạng thái hiển thị dựa trên các điều kiện
      if (friend === true) {
        setDisplayMode("friend");
      } else if (receiver === false && sender === false) {
        setDisplayMode("sendRequest");
      } else if (recipient === false) {
        setDisplayMode("sentRequest");
      } else {
        setDisplayMode("acceptRequest");
      }
    }, [friend, receiver, sender, recipient]);

    const renderDisplay = () => {
      switch (displayMode) {
        case "none":
          return null; // Không hiển thị gì cả
        case "friend":
          return null;
        case "sendRequest":
          return (
            <TouchableOpacity
              onPress={handleSendRequest}
              style={{
                backgroundColor: "silver",
                color: "#fff",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Gửi lời mời kết bạn</Text>
            </TouchableOpacity>
          );
        case "sentRequest":
          return (
            <View
              style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: "#555" }}>
                Đã gửi lời mời kết bạn tới người dùng này
              </Text>
            </View>
          );
        case "acceptRequest":
          return (
            <TouchableOpacity
              onPress={handleAcceptRequest}
              style={{
                backgroundColor: "silver",
                color: "#fff",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Chấp nhận lời mời kết bạn</Text>

            </TouchableOpacity>
          );
        default:
          return null;
      }
    };

    const handleSendRequest = () => {
      console.log(`Gửi lời mời kb tới id: ${idAccept}`);
    };

    const handleAcceptRequest = () => {
      // Xử lý logic khi nhấp vào nút "Chấp nhận lời mời kết bạn"
      // console.log('Id của người chấp nhận lời mời kết bạn:', idAccept);
      console.log(`Chấp nhận lời mời kết bạn của: ${idAccept}`);
      const dataId = {
          id: idAccept,
      }
      const roomId = {
        idRooms: id,
      }
      acceptFriends(dataId.id, roomId)
      .then((res) => {
          if (!res.data) {
              alert('Đồng ý kết bạn không thành công')
              return;
          }
          alert("Bây giờ các bạn là bạn bè")
      })
      .catch((err) => {
        console.log(err);
          alert("Lỗi hệ thống")
      })
  };
  const handleFileChangeImage = async () => {
    try {
      const file = await FilePicker.getDocumentAsync({
        // multiple: true,
        copyToCacheDirectory: true,
        // type
      })
      // console.log(file.assets[0])

      setTexting(file.assets[0].name)
      setSendImage(file.assets)
    } catch (error) {
      console.error('Lỗi khi chọn file:', error);
    }
  };
  const handleFileChange = async () => {
    try {
      const file = await FilePicker.getDocumentAsync({
        // multiple: true,
        copyToCacheDirectory: true,
        // type
      })
      // console.log(file.assets[0])

      setTexting(file.assets[0].name)
      setSendFile(file.assets)
    } catch (error) {
      console.error('Lỗi khi chọn file:', error);
    }
  };
  const messageRemoved = (content) => {
    if (content === "") {
      return "Tin nhắn đã được thu hồi"
    }
    else {
      return content;
    }
  }
console.log('====================================');
console.log(messages);
console.log('====================================');
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
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
            {friend ? (
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

        {/* Phần hiển thị thông tin và chức năng kết bạn */}
        {renderDisplay()}
        <ScrollView ref={messRef} style={styles.messageContent}>
  {/* Hiển thị tin nhắn */}
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
      <View>
      {/* Avatar của người gửi tin nhắn */}
      {message.author.email !== user.email && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: message.author.avatar }}
            style={styles.avatar}
          />
        </View>
      )}
      {/* Nội dung tin nhắn */}
      </View>
<View style={[styles.messageContainer, message.author.email === user.email ? styles.messageContainerAuthor : styles.messageContainerReceiver]}>
  <View style={styles.messageTextContainer}>
    <View style={styles.messageOptions}>
      {/* Nút chỉnh sửa và xóa */}
      {message.author.email === user.email && (
        <TouchableOpacity
          onPress={() => handleShowOptions(index)}
          style={styles.optionsButton}
        >
          <Entypo
            name="dots-three-vertical"
            size={16}
            color="silver"
          />
        </TouchableOpacity>
      )}
      {/* Hiển thị menu options */}
      {showOptions && selectedMessageIndex === index && (
        <View style={styles.messageOptions}>
          {/* Nút chỉnh sửa */}
          <TouchableOpacity
            style={[styles.optionButton, styles.editOption]}
            onPress={handleEditMessage}
          >
            <Text style={styles.optionTextChinhSua}>Chỉnh sửa</Text>
          </TouchableOpacity>
          {/* Nút xóa */}
          <TouchableOpacity
            style={[styles.optionButton, styles.deleteOption]}
            onPress={handleDeleteMessage}
          >
            <Text style={styles.optionTextXoa}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
   {/* Hiển thị nội dung của tin nhắn */}
   <Text style={[styles.messageText, message.author.email === user.email ? styles.messageTextAuthor : styles.messageTextReceiver]}>
            {SendToMesageImage(messageRemoved(message.content))}
          </Text>
        </View>
        {/* Hiển thị thời gian của tin nhắn */}
        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>

))}
  
</ScrollView>

        {/* Phần input tin nhắn */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Tin nhắn..."
            value={texting}
            onChangeText={handleTexting}
          />
          {/* Các nút hoặc chức năng khác */}
          <TouchableOpacity style={styles.fileButton} onPress={handleFileChange}>
            <Ionicons name="document-attach-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fileButton} onPress={handleFileChangeImage}>
            <Ionicons name="image" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMess}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    //flexWrap: 'wrap',

  },
  message: {
    flexDirection: 'row',
    marginVertical: 5,
    //maxWidth: "80%",
    marginTop:5,

  },
  messageContainerReceiver:{
  backgroundColor: 'silver',
  marginTop: 5,
  borderRadius :'10',
  maxWidth: '50%',
  padding: 10,
  },
  messageContainerAuthor:{
    backgroundColor: "#ffa500",
    marginTop: 5,
    borderRadius :'10',
    maxWidth: '50%',
    padding: 10,
  },
  messageAuthor: {
    alignSelf: "flex-end",

  },
  messageReceiver: {
    alignSelf: 'flex-start',

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
    //flexGrow: 1, // Cho phép thanh tin nhắn mở rộng tự động
  },
  messageText: {
    color: "#fff",
    // padding: 10,

  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    //marginTop: 50, // Thêm margin top để nâng cao phần input
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
  fileButton: {
    backgroundColor: "silver",
    padding: 10,
    borderRadius: 5,
  },
  inviteButton: {
    backgroundColor: "silver",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  optionsButton: {
    position: "absolute",
    left: 50, // Đặt dấu ba chấm bên trái của layout tin nhắn
    top: "50%", // Đặt dấu ba chấm ở giữa chiều dọc
    transform: [{ translateY: 10 }], // Dịch chuyển dấu ba chấm lên trên một chút để căn giữa
  },
  messageOptions: {
    position: "absolute",
    left: -70, // Đặt menu options ở bên trái của nút ba chấm
    top: "50%", // Đặt menu options ở giữa chiều dọc
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 5,
    transform: [{ translateY: -20 }], // Dịch chuyển menu xuống dưới một chút
  },
  optionButton: {
    padding: 10,

  },
  optionTextChinhSua: {
    fontWeight: "bold",
  },
  optionTextXoa: {
    fontWeight: "bold",
    color: "red",
    justifyContent: "center",
  },
  editOption: {
    backgroundColor: "silver",
    width: 100,
    borderRadius: 10,
  },
  deleteOption: {
    backgroundColor: "silver",
    width: 100,
    borderRadius: 10,
  },
   time: {
    alignSelf: "flex-end",
    fontSize: 10,
    color: "black",
    marginTop: 5,
  },
});

export default Message;

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
//   Platform,
//   Linking,
// } from "react-native";
// import { SocketContext } from "../../../untills/context/SocketContext";
// import {
//   getRoomsMessages,
//   createMessage,
//   acceptFriends,
//   createMessagesFile,
//   deleteMessages,
// } from "../../../untills/api";
// import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
// import { AuthContext } from "../../../untills/context/AuthContext";
// import { useNavigation } from "@react-navigation/native";
// import * as DocumentPicker from "expo-document-picker";
// import * as ImagePicker from "expo-image-picker";
// import * as FilePicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
// import { KeyboardAvoidingView } from "react-native";

// import { ActivityIndicator } from "react-native";

// export const Message = ({ route }) => {
//   const { id, fullName, friend, receiver, sender, recipient, idAccept } =
//     route.params;

//   const [messages, setMessages] = useState([]);
//   const socket = useContext(SocketContext);
//   const [texting, setTexting] = useState("");
//   const messRef = useRef();
//   const { user } = useContext(AuthContext);
//   const nav = useNavigation();
//   const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [displayMode, setDisplayMode] = useState("none");
//   const [areFriends, setAreFriends] = useState(false);
//   const [isActive, setIsActive] = useState(false);
//   const [sendFile, setSendFile] = useState([]);
//   const [sendImage, setSendImage] = useState([]);
//   const fileInputRef = useRef();
//   const [clickedMessage, setClickedMessage] = useState(null);
//   //const fullName = route.params && route.params.full_name;

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
//     socket.on(`createMessage${id}`, (messagesSocket) => {
//       setMessages((prevMessages) => [...prevMessages, messagesSocket.message]);
//     });

//     socket.on(`deleteMessage${id}`, (data) => {
//       if (data) {
//         setMessages((prevMessages) =>
//           prevMessages.filter((item) => item._id !== data.idMessages)
//         );
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           ...data.roomsUpdate.messages,
//         ]);
//       }
//     });

//     socket.on(`updatedMessage${id}`, (data) => {
//       if (data) {
//         setMessages(data.messagesCN);
//       }
//     });

//     socket.on(`acceptFriends${id}`, (data) => {
//       if (data) {
//         setAreFriends(true);
//         setDisplayMode("friend");
//       }
//     });

//     return () => {
//       socket.off(`createMessage${id}`);
//       socket.off(`deleteMessage${id}`);
//       socket.off(`updatedMessage${id}`);
//       socket.off(`acceptFriends${id}`);
//     };
//   }, [id, socket]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const data = await getRoomsMessages({ roomsId: id });
//         setMessages(data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchMessages();
//   }, [id]);

//   useEffect(() => {
//     const handleSocketEvents = () => {
//       socket.on("connected", () => console.log("Connected"));
//       socket.on(id, (messagesSocket) => {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           messagesSocket.message,
//         ]);
//       });
//     };

//     handleSocketEvents();

//     return () => {
//       socket.off("connected");
//       socket.off(id);
//     };
//   }, [id, socket]);

//   const scrollToBottom = () => {
//     if (messRef.current) {
//       messRef.current.scrollToEnd({ animated: true });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleTexting = (text) => {
//     setTexting(text);
//   };

//   const handleSendMess = () => {
//     if (texting === "") {
//       Alert.alert("Please enter a message");
//       return;
//     } else if (!id) {
//       Alert.alert("Cannot find the room you want to send a message to");
//       return;
//     } else {
//       setIsActive(true);
//       if (sendFile.length > 0) {
//         const formData = new FormData();
//         formData.append("file", sendFile[0].file);

//         createMessagesFile(formData)
//           .then((resFile) => {
//             const data1 = {
//               content: resFile.data,
//               roomsID: id,
//             };

//             createMessage(data1)
//               .then((res) => {
//                 setTexting("");
//                 setSendFile([]);
//                 if (res.data.status === 400) {
//                   Alert.alert(
//                     "You and this person are no longer friends so you cannot message each other"
//                   );
//                 }
//                 setTimeout(() => {
//                   setIsActive(false);
//                 }, 300);
//               })
//               .catch((err) => {
//                 if (err.status === 400) {
//                   Alert.alert("Server error");
//                 }
//               });
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       } else if (sendImage.length > 0) {
//         const formData1 = new FormData();
//         formData1.append("file", sendImage[0].file);

//         createMessagesFile(formData1)
//           .then((resFile) => {
//             const data2 = {
//               content: resFile.data,
//               roomsID: id,
//             };
//             createMessage(data2)
//               .then((res) => {
//                 setTexting("");
//                 setSendImage([]);
//                 if (res.data.status === 400) {
//                   Alert.alert(
//                     "You and this person are no longer friends so you cannot message each other"
//                   );
//                 }
//                 setTimeout(() => {
//                   setIsActive(false);
//                 }, 300);
//               })
//               .catch((err) => {
//                 if (err.status === 400) {
//                   Alert.alert("Server error");
//                 }
//               });
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       } else {
//         const data = {
//           content: texting,
//           roomsID: id,
//         };
//         createMessage(data)
//           .then((res) => {
//             setTexting("");
//             if (res.data.status === 400) {
//               Alert.alert(
//                 "You and this person are no longer friends so you cannot message each other"
//               );
//             }
//             setTimeout(() => {
//               setIsActive(false);
//             }, 300);
//           })
//           .catch((err) => {
//             if (err.status === 400) {
//               Alert.alert("Server error");
//             }
//           });
//       }
//     }
//   };

//   useEffect(() => {
//     clearTimeout(clickedMessage);
//   }, [texting]);

//   useEffect(() => {
//     let timer;
//     if (clickedMessage) {
//       timer = setTimeout(() => {
//         setClickedMessage(null);
//       }, 2000);
//     }
//     return () => clearTimeout(timer);
//   }, [clickedMessage]);

//   const onPickFile = async () => {
//     try {
//       const file = await DocumentPicker.getDocumentAsync();
//       if (file.type !== "cancel") {
//         const fileData = {
//           uri: file.uri,
//           type: file.type,
//           name: file.name,
//         };
//         setSendFile([{ file: fileData }]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onPickImage = async () => {
//     try {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Sorry, we need camera roll permissions to make this work!"
//         );
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.cancelled) {
//         const image = {
//           uri: result.uri,
//           type: "image/jpeg",
//           name: result.uri.split("/").pop(),
//         };
//         setSendImage([{ file: image }]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onOpenFilePicker = () => {
//     fileInputRef.current.click();
//   };

//   const onFileInputChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileData = {
//         uri: URL.createObjectURL(file),
//         type: file.type,
//         name: file.name,
//       };
//       setSendFile([{ file: fileData }]);
//     }
//   };

//   const onImageInputChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const image = {
//           uri: e.target.result,
//           type: file.type,
//           name: file.name,
//         };
//         setSendImage([{ file: image }]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onMessageLongPress = (index) => {
//     setSelectedMessageIndex(index);
//     setShowOptions(true);
//   };

//   const onDeleteMessage = async () => {
//     const messageId = messages[selectedMessageIndex]._id;
//     try {
//       await deleteMessages(messageId);
//       setShowOptions(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const isCurrentUser = (message) => {
//     return message.user && message.user.id === currentUser.id;
//   };

//   const renderMessages = () => {
//     return messages.map((message, index) => {
//       const senderFullName = message.user && message.user.fullName;
//       return (
//         <TouchableOpacity
//           key={index}
//           onLongPress={() => onMessageLongPress(index)}
//         >
//           <View style={[styles.messageBubble]}>
//             <Text style={[styles.sender]}>{senderFullName}</Text>
//             <Text style={[styles.messageText]}>{message.content}</Text>
//             <Text style={[styles.time]}>
//               {new Date(message.createdAt).toLocaleTimeString()}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       );
//     });
//   };
  
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => nav.goBack()} style={styles.goBackButton}>
//           <AntDesign name="arrowleft" size={24} color="black" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Text style={styles.fullName}>{fullName}</Text>
//           {friend ? (
//             <Text style={[styles.friendStatus, styles.italic]}>Bạn bè</Text>
//           ) : (
//             <Text style={[styles.strangerStatus, styles.italic]}>Người lạ</Text>
//           )}
//         </View>
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

//       {/* Hiển thị tin nhắn */}
//       <ScrollView ref={messRef} contentContainerStyle={{ flexGrow: 1 }}>
//         {messages.map((message, index) => {
//           const senderFullName = message.user && message.user.fullName;
//           const isUser = isCurrentUser(message);
//           const avatar = message.user && message.user.avatar; // Đường dẫn đến avatar của người gửi tin nhắn
//           return (
//             <TouchableOpacity key={index}>
//               <View
//                 style={[
//                   styles.messageBubble,
//                   isUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
//                 ]}
//               >
//                 {!isUser && (
//                   <View style={styles.avatarContainer}>
//                     <Image source={{ uri: avatar }} style={styles.avatar} />
//                   </View>
                 
//                 )}
//                 {!isUser && <Text style={styles.sender}>{senderFullName}</Text>}
//                 <Text style={styles.messageText}>{message.content}</Text>
//                 <Text style={styles.time}>
//                   {new Date(message.createdAt).toLocaleTimeString()}
//                 </Text>
//               </View>
              
//             </TouchableOpacity>
//           );
//         })}
        
//       </ScrollView>

//       {/* Phần input tin nhắn */}
//       <View style={styles.inputContainer}>
//         <TouchableOpacity onPress={onPickFile}>
//           <FontAwesome name="paperclip" size={24} color="#000" style={styles.iconStyle} />
//         </TouchableOpacity>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Nhập tin nhắn..."
//           value={texting}
//           onChangeText={handleTexting}
//           multiline
//         />
//         <TouchableOpacity onPress={handleSendMess}>
//           <Ionicons name="send" size={24} color="black" style={styles.iconStyle} />
//         </TouchableOpacity>
//       </View>
//       {/* Các phần còn lại của giao diện */}
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
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#ff8c00",
//     height: 80, // Chiều cao của thanh header
//   },
//   goBackButton: {
//     marginRight: 10, // Khoảng cách giữa nút quay lại và nội dung header
//   },
//   headerContent: {
//     flexDirection: "column", // Thay đổi thành column
//     alignItems: "flex-start", // Đảm bảo căn trái cho nội dung
//     flex: 1, // Chia phần còn lại của header
//   },
//   headerRight: {
//     flexDirection: "row",
//   },
//   headerButton: {
//     marginLeft: 5,
//     marginRight: 10,
//   },
//   fullName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "black",
//   },
//   friendStatus: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "black",
//     fontStyle: "italic",
//   },
//   strangerStatus: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "black",
//     fontStyle: "italic",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderTopWidth: 0.5,
//     borderTopColor: "#dedede",
//   },
//   messageBubbleRight:{
//     backgroundColor :'#ffa500' // Màu nền cho tin nhắn của người dùng
//   },
//   textInput: {
//     flex: 1,
//     paddingVertical: Platform.OS === "android" ? 5 : 15,
//     paddingHorizontal: 20,
//     backgroundColor: "#ececec",
//     borderRadius: 30,
//     marginRight: 10,
//   },
//   iconStyle: {
//     marginLeft: 10,
//   },
//   messageBubble: {
//     backgroundColor: "#fff",
//     padding: 10,
//     marginVertical: 5,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     alignSelf: "flex-start",
//     maxWidth: "80%",
//   },
//   sender: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   messageText: {},
//   time: {
//     alignSelf: "flex-end",
//     fontSize: 10,
//     color: "#A9A9A9",
//     marginTop: 5,
//   },
//   avatarContainer: {
//     marginRight: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
// });

// export default Message;