import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { getRoomsMessages, createMessage, acceptFriends, createMessagesFile } from "../../../untills/api";
import { SocketContext } from "../../../untills/context/SocketContext";
import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FilePicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
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

  const types = {
    TEXT: 'text',
    FILE: 'file'
}


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

  const handleFileButtonPress = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.type === 'success') {
        // Lưu tên của file vào trường texting
        setTexting(`File đã chọn: ${file.name}`);
       
        
      }
    } catch (error) {
      console.error('Lỗi khi chọn file:', error);
    }
  };
  



//   const pickFile = async () => {
//     let file = await FilePicker.getDocumentAsync({
//         // multiple: true,
//         copyToCacheDirectory: true,
//         // type
//     })
//     if (!result.canceled) {
//         const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
//             encoding: FileSystem.EncodingType.Base64,
//         });
//         setSendFile([...sendFile, {
//             base64,
//             originalname: result.assets[0].name,
//             uri: result.assets[0].uri,
//             mimetype: result.assets[0].mimeType,
//             size: result.assets[0].size
//         }])
//     }
// };
const pickFile = async () => {
  try {
    const file =  await FilePicker.getDocumentAsync({
      // multiple: true,
      copyToCacheDirectory: true,
      // type
  })
  if (!file.canceled) {
    const base64 = await FileSystem.readAsStringAsync(file.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    console.log(file.assets[0])
}
//     if (file.type === 'success') {
//       console.log('File đã chọn:', file); // Log thông tin về file đã chọn
//       // Chuyển đổi file thành base64
//       const base64 = await FileSystem.readAsStringAsync(file.uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
// console.log(base64);
    
//       const data = {
//         content: base64,
//         roomsID: id,
//       };

//       createMessage(data)
//         .then((res) => {
//           setTexting("");
//           if (res.data.status === 400) {
//             Alert.alert("You and this person are no longer friends so you cannot message each other");
//           }
//           setTimeout(() => {
//             setIsActive(false);
//           }, 300);
//         })
//         .catch((err) => {
//           if (err.status === 400) {
//             Alert.alert("Server error");
//           }
//         });
//     }
  } catch (error) {
    console.error('Lỗi khi chọn file:', error);
  }
};


  // const handleSendMess = () => {
  //   if (texting === '') {
  //     Alert.alert("Please enter a message");
  //     return;
  //   } else if (!id) {
  //     Alert.alert("Không thể tìm thấy phòng bạn muốn gửi tin nhắn");
  //     return;
  //   } else {
  //     setIsActive(true);
  //     if (sendFile && sendFile.length > 0) {
  //       const formData = new FormData();
  //       formData.append('file', sendFile[0]);
  //       createMessagesFile(formData)
  //       .then((resFile) => {
  //         const data1 = {
  //           content: resFile.data,
  //           roomsID: id,
  //         };
  //         createMessage(data1)
  //         .then((res) => {
  //           setTexting("");
  //           setSendFile([]);
  //           if (res.data.status === 400) {
  //             Alert.alert("Bạn và người này không còn là bạn nên không thể nhắn tin cho nhau");
  //             // window.location.reload(); 
  //           }
  //           setTimeout(() => {
  //             setIsActive(false);
  //           }, 300);
  //         })
  //         .catch((err) => {
  //           if (err.status === 400) {
  //             Alert.alert("Server error");
  //             // window.location.reload();
  //           }
  //         })
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //     } else if (sendImage && sendImage.length > 0) {
  //       const formData1 = new FormData();
  //       formData1.append('file', sendImage[0]);
  //       createMessagesFile(formData1)
  //       .then((resFile) => {
  //         const data2 = {
  //           content: resFile.data,
  //           roomsID: id,
  //         };
  //         createMessage(data2)
  //         .then((res) => {
  //           setTexting("");
  //           setSendImage([]);
  //           if (res.data.status === 400) {
  //             Alert.alert("You and this person are no longer friends so you cannot message each other");
  //             // window.location.reload();
  //           }
  //           setTimeout(() => {
  //             setIsActive(false);
  //           }, 300);
  //         })
  //         .catch((err) => {
  //           if (err.status === 400) {
  //             Alert.alert("Server error");
  //             // window.location.reload();
  //           }
  //         })
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //     } else {
  //       const data = {
  //         content: texting,
  //         roomsID: id,
  //       };
  //       createMessage(data)
  //       .then((res) => {
  //         setTexting("");
  //         if (res.data.status === 400) {
  //           Alert.alert("You and this person are no longer friends so you cannot message each other");
  //           // window.location.reload();
  //         }
  //         setTimeout(() => {
  //           setIsActive(false);
  //         }, 300);
  //       })
  //       .catch((err) => {
  //         if (err.status === 400) {
  //           Alert.alert("Server error");
  //           // window.location.reload();
  //         }
  //       })
  //     }
  //   }
  // };
  const handleSendMess = () => {
    if (texting === '') {
      Alert.alert("Please enter a message");
      return;
    } else if (!id) {
      Alert.alert("Không thể tìm thấy phòng bạn muốn gửi tin nhắn");
      return;
    } else {
      setIsActive(true);
      if (sendFile && sendFile.length > 0) {
        const formData = new FormData();
        // Thêm thông tin về file vào formData
        sendFile.forEach(file => {
          formData.append('files', {
            uri: file.uri,
            type: file.mimetype,
            name: file.originalname,
          });
        });
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
      } else {
        // Xử lý gửi tin nhắn văn bản khi không có file được chọn
        const data = {
          content: texting,
          roomsID: id,
        };
        createMessage(data)
        .then((res) => {
          setTexting("");
          if (res.data.status === 400) {
            Alert.alert("You and this person are no longer friends so you cannot message each other");
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
      return <Image source={{ uri: mm }} style={{ maxWidth: 300, maxHeight: 300 }} />;
  }
  else if (mm.endsWith('.docx')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' }} style={{ maxWidth: 130, maxHeight: 130 }} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.pdf')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' }} style={{ maxWidth: 130, maxHeight: 130 }} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.rar')) {
      return (
          <TouchableOpacity onPress={() => Linking.openURL(mm)}>
              <Image source={{ uri: 'https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' }} style={{ maxWidth: 130, maxHeight: 130 }} />
          </TouchableOpacity>
      );
  }
  else if (mm.endsWith('.mp4')) {
      return <Video source={{ uri: mm }} style={{ maxWidth: 300, maxHeight: 300 }} />;
  }
  else {
      return <Text>{mm}</Text>;
  }
}


  const [requestSent, setRequestSent] = useState(false);

  const handleEditMessage = () => {
    // Xử lý khi nhấn nút chỉnh sửa tin nhắn
    // Ví dụ:
    console.log("Chỉnh sửa tin nhắn:", messages[selectedMessageIndex]);
    setShowOptions(false); // Đóng options sau khi thực hiện hành động
  };

  const handleDeleteMessage = () => {
    // Xử lý khi nhấn nút xóa tin nhắn
    // Ví dụ:
    
    console.log("Xóa tin nhắn:", messages[selectedMessageIndex]);
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

      {renderDisplay()}

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
              <View style={styles.messageOptions}>
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
                {showOptions && selectedMessageIndex === index && (
                  <View style={styles.messageOptions}>
                    <TouchableOpacity
                      style={[styles.optionButton, styles.editOption]}
                      onPress={handleEditMessage}
                    >
                      <Text style={styles.optionTextChinhSua}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.optionButton, styles.deleteOption]}
                      onPress={handleDeleteMessage}
                    >
                      <Text style={styles.optionTextXoa}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
   <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
        <Ionicons name="document-attach-outline" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
        <Ionicons name="image" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.sendButton} onPress={handleSendMess}>
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
    borderRadius :10
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
});

export default Message;
