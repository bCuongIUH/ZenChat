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
  Platform,
  Linking,
} from "react-native";
import {
  getRoomsMessages,
  createMessage,
  acceptFriends,
  createMessagesFile,
  deleteMessages,
  getGroupsMessages,
  createMessagesGroup,
  createMessagesGroupFeedBack,
  deleteMessagesGroups,
  recallMessagesGroups,
  createGroups,
  getListGroups,
  getListRooms
} from "../../../untills/api";
import { SocketContext } from "../../../untills/context/SocketContext";
import { Ionicons, FontAwesome, Entypo, AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FilePicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { KeyboardAvoidingView } from "react-native";
import { FlatList } from "react-native";

export const MessageGroup = ({ route }) => {
  // const { groupID, fullName, group,avtGroups, nameGroups} = route.params;
  const { group} = route.params;
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [texting, setTexting] = useState("");
  //const messRef = useRef();
  const { user } = useContext(AuthContext);
  const nav = useNavigation();
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [displayMode, setDisplayMode] = useState("none");
  const [areFriends, setAreFriends] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [sendFile, setSendFile] = useState([]);
  const [sendImage, setSendImage] = useState([]);
  // const fileInputRef = useRef();
  const [clickedMessage, setClickedMessage] = useState(null);
  const [files, setFiles] = useState([]);
  const [messagesGroups, setMessagesGroups] = useState([]);
  const [participants, setParticipants] = useState([]);
  // const [leader, setLeader] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [friendsGroup, setFriendGroup] = useState([]);

  useEffect(()=>{
    console.log("tên gì");
  })
  
//   useEffect(() => {
//     if (group === undefined) {
//       return;
//     }
//     if (user.email === group.creator.email) {
//       setLeader(true);
//     } else {
//       setLeader(false);
//     }
//     const GroupMessages = {
//       groupId: group._id,
//     };

//     getGroupsMessages(GroupMessages)
//       .then((data) => {
//         setMessagesGroups(data.data);
//         setParticipants(group.participants);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [group]);
// console.log("thong tin groups",group);
//   //  hiển thị lấy tin nhắn ở api ra 
//   useEffect(() => {
//     const RoomMessages = {
//       groupId: groupID
//     }
//     getGroupsMessages(RoomMessages)
//         .then((data) => {
//             setMessagesGroups(data.data);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
//   }, [groupID])
//   // 
//   useEffect(() => {
//     if (group === undefined) {
//       return;
//     }
//     socket.on("connected", () => console.log("Connected"));
//     socket.on(`leaveGroupsId${groupID}`, (data) => {
//       if (data.userLeave !== user.email) {
//         setParticipants(data.groupsUpdate.participants);
//       }
//     });
//     socket.on(groupID, (data) => {
//       setMessagesGroups((prevMessages) => [...prevMessages, data.message]);
//     });
//     return () => {
//       socket.off("connected");
//       // socket.off(`leaveGroupsId${group._id}`);
//       socket.off(groupID);
//     };
//   }, [socket, group]);


//   console.log("noi dung", group);
//   const setTingNameGroups = (group) => {
//     if (group.nameGroups === "") {
//       return `Groups của ${group.creator.fullName}`;
//     } else {
//       return group.nameGroups;
//     }
//   };
//   const messRef = useRef();
//   const ScrollbarCuoi = () => {
//     const scroll = messRef.current;
//     if (scroll) {
//       scroll.scrollTop = scroll.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       ScrollbarCuoi();
//     }, 500);
//   }, [messagesGroups]);

//   const handleButtonClick = () => {
//     if (thuNhoBaRef.current.style.width === "100%") {
//       thuNhoBaRef.current.style.width = "64%";
//       thuNhoBonRef.current.style.width = "36%";
//     } else {
//       thuNhoBaRef.current.style.width = "100%";
//       thuNhoBonRef.current.style.width = "0";
//     }
//   };

//   // nút chọn file đề gửi làm trên expo
//   const handleFileButtonPress = async () => {
//     try {
//       const file = await DocumentPicker.getDocumentAsync();
//       const fileData = new FormData();
//       fileData.append("file", {
//         uri: file.uri,
//         name: file.name,
//         type: file.type,
//       });
//       const RoomMessages = {
//         roomsId: groupID,
//       };
//       getGroupsMessages(RoomMessages)
//         .then(() => {
//           createMessagesFile(groupID, fileData)
//             .then(() => {
//               setSendFile([...sendFile, file.uri]); // Update sendFile state with the new file URI
//               setTexting(file.name); // Set the file name as the text in the input
//             })
//             .catch((err) => console.log(err));
//         })
//         .catch((err) => console.log(err));
//     } catch (err) {
//       console.log(err);
//     }
//   };
  
//   // nút chọn ảnh để gửi làm trên expo
//   const handleImageButtonPress = async () => {
//     try {
//       const image = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!image.cancelled) {
//         const RoomMessages = {
//           roomsId: groupID,
//         };
//         getRoomsMessages(RoomMessages)
//           .then(() => {
//             const imageData = new FormData();
//             imageData.append("file", {
//               uri: image.uri,
//               name: image.uri.split("/").pop(),
//               type: "image/jpeg",
//             });
//             createMessagesFile(groupID, imageData)
//               .then(() => setSendImage([...sendImage, image.uri]))
//               .catch((err) => console.log(err));
//           })
//           .catch((err) => console.log(err));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const thuNhoBaRef = useRef();
//   const thuNhoBonRef = useRef();
//   const refMessRef = useRef();
//   const closeModal = () => {
//     setShowOptions(false);
//   };

//   const updateUserGroups = () => {
//     const userGroups = {
//       email: user.email,
//       group: group,
//     };
//     acceptFriends(groupID, userGroups)
//       .then(() => {
//         setIsActive(true);
//         setTimeout(() => {
//           setIsActive(false);
//         }, 5000);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const handleFileSelect = async () => {
//     try {
//       const file = await DocumentPicker.getDocumentAsync();
//       const fileData = new FormData();
//       fileData.append("file", {
//         uri: file.uri,
//         name: file.name,
//         type: file.type,
//       });
//       const RoomMessages = {
//         roomsId: groupID,
//       };
//       getRoomsMessages(RoomMessages)
//         .then(() => {
//           createMessagesFile(groupID, fileData)
//             .then(() => setSendFile([...sendFile, file.uri]))
//             .catch((err) => console.log(err));
//         })
//         .catch((err) => console.log(err));
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     const handleSocketEvents = () => {
//       socket.on("connected", () => console.log("Connected"));
//       socket.on(groupID, (messagesSocket) => {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           messagesSocket.message,
//         ]);
//       });
//     };

//     handleSocketEvents();

//     return () => {
//       socket.off("connected");
//       socket.off(groupID);
//     };
//   }, [groupID, socket]);

//   const handleImageSelect = async () => {
//     try {
//       const image = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!image.cancelled) {
//         const RoomMessages = {
//           roomsId: groupID,
//         };
//         getRoomsMessages(RoomMessages)
//           .then(() => {
//             const imageData = new FormData();
//             imageData.append("file", {
//               uri: image.uri,
//               name: image.uri.split("/").pop(),
//               type: "image/jpeg",
//             });
//             createMessagesFile(groupID, imageData)
//               .then(() => setSendImage([...sendImage, image.uri]))
//               .catch((err) => console.log(err));
//           })
//           .catch((err) => console.log(err));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const openFile = (file) => {
//     Linking.openURL(file);
//   };

//   console.log("====================================");
//   console.log("id nhóm", nameGroups);
//   console.log("====================================");

//   //thực hiện gửi tin nhắn
//   // const handleSendMess = () => {
//   //   if (texting === "") {messagesGroups
//   //     alert("Mời bạn nhập tin nhắn");
//   //     return;
//   //   } else if (!groupID) {
//   //     alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
//   //     return;
//   //   } else {
//   //     // feedback
//   //     setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
//   //     if (sendFile.length > 0) {
//   //       const formData = new FormData();
//   //       formData.append("file", sendFile[0]);
//   //       createMessagesFile(formData)
//   //         .then((resFile) => {
//   //           if (clickedMessageFeedBackOb) {
//   //             const dataGroupsMessages = {
//   //               content: resFile.data,
//   //               idMessages: clickedMessageFeedBackOb._id,
//   //             };
//   //             createMessagesGroupFeedBack(group._id, dataGroupsMessages)
//   //               .then((res) => {
//   //                 setTexting("");
//   //                 setSendFile([]);
//   //                 ScrollbarCuoi();
//   //                 setClickedMessageFeedBackOb(undefined);
//   //                 if (res.data.status === 400) {
//   //                   alert("Hiện tại bạn không còn trong nhóm này");
//   //                   window.location.reload();
//   //                 }
//   //                 setTimeout(() => {
//   //                   setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //                 }, 300);
//   //                 //console.log(res.data);
//   //                 console.log("tin nhắn handleSendMessGR", res.data);
//   //               })
//   //               .catch((err) => {
//   //                 if (err.status === 400) {
//   //                   alert("Lỗi Server");
//   //                   window.location.reload();
//   //                 }
//   //               });
//   //           } else {
//   //             const data1 = {
//   //               content: resFile.data,
//   //               groupsID: groupID,
//   //             };
//   //             createMessagesGroup(data1)
//   //               .then((res) => {
//   //                 setTexting("");
//   //                 setSendFile([]);
//   //                 setMessagesGroups([...messagesGroups, res.data]);
//   //                 ScrollbarCuoi();
//   //                 if (res.data.status === 400) {
//   //                   alert("Hiện tại bạn không còn trong nhóm này");
//   //                   window.location.reload();
//   //                 }
//   //                 setTimeout(() => {
//   //                   setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //                 }, 300);
//   //                 //console.log(res.data);
//   //               })
//   //               .catch((err) => {
//   //                 if (err.status === 400) {
//   //                   alert("Lỗi Server");
//   //                   window.location.reload();
//   //                 }
//   //               });
//   //           }
//   //         })
//   //         .catch((err) => {
//   //           console.log(err);
//   //         });
//   //     } else if (sendImage.length > 0) {
//   //       const formData1 = new FormData();
//   //       formData1.append("file", sendImage[0]);
//   //       createMessagesFile(formData1)
//   //         .then((resFile) => {
//   //           if (clickedMessageFeedBackOb) {
//   //             const dataMessagesGroups2 = {
//   //               content: resFile.data,
//   //               idMessages: clickedMessageFeedBackOb._id,
//   //             };
//   //             createMessagesGroupFeedBack(group._id, dataMessagesGroups2)
//   //               .then((res) => {
//   //                 setTexting("");
//   //                 setSendImage([]);
//   //                 ScrollbarCuoi();
//   //                 setClickedMessageFeedBackOb(undefined);
//   //                 if (res.data.status === 400) {
//   //                   alert("Hiện tại bạn không còn trong nhóm này");
//   //                   window.location.reload();
//   //                 }
//   //                 setTimeout(() => {
//   //                   setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //                 }, 300);
//   //                 //console.log(res.data);
//   //               })
//   //               .catch((err) => {
//   //                 if (err.status === 400) {
//   //                   alert("Lỗi Server");
//   //                   window.location.reload();
//   //                 }
//   //               });
//   //           } else {
//   //             const data2 = {
//   //               content: resFile.data,
//   //               groupsID: group._id,
//   //             };
//   //             createMessagesGroup(data2)
//   //               .then((res) => {
//   //                 setTexting("");
//   //                 setSendImage([]);
//   //                 ScrollbarCuoi();
//   //                 if (res.data.status === 400) {
//   //                   alert("Hiện tại bạn không còn trong nhóm này");
//   //                   window.location.reload();
//   //                 }
//   //                 setTimeout(() => {
//   //                   setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //                 }, 300);
//   //                 //console.log(res.data);
//   //                 console.log("tin nhắn handleSendMessGR", res.data);
//   //               })
//   //               .catch((err) => {
//   //                 if (err.status === 400) {
//   //                   alert("Lỗi Server");
//   //                   window.location.reload();
//   //                 }
//   //               });
//   //           }
//   //         })
//   //         .catch((err) => {
//   //           console.log(err);
//   //         });
//   //     } else {
//   //       if (clickedMessageFeedBackOb) {
//   //         const dataMessagesGroups3 = {
//   //           content: texting,
//   //           idMessages: clickedMessageFeedBackOb._id,
//   //         };
//   //         createMessagesGroupFeedBack(group._id, dataMessagesGroups3)
//   //           .then((res) => {
//   //             setTexting("");
//   //             ScrollbarCuoi();
//   //             setClickedMessageFeedBackOb(undefined);
//   //             if (res.data.status === 400) {
//   //               alert("Hiện tại bạn không còn trong nhóm này");
//   //               window.location.reload();
//   //             }
//   //             setTimeout(() => {
//   //               setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //             }, 300);
//   //             //console.log(res.data);
            
            
           
//   //           })
//   //           .catch((err) => {
//   //             if (err.status === 400) {
//   //               alert("Lỗi Server");
//   //               window.location.reload();
//   //             }
//   //           });
//   //       } else {
//   //         const data = {
//   //           content: texting,
//   //           groupsID: groupID,
//   //         };
//   //         createMessagesGroup(data)
//   //           .then((res) => {
//   //             setTexting("");

//   //             if (res.data.status === 400) {
//   //               alert("Hiện tại bạn không còn trong nhóm này");
//   //               window.location.reload();
//   //             }
//   //             setTimeout(() => {
//   //               setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//   //             }, 300);
//   //           })
//   //           .catch((err) => {
//   //             if (err.status === 400) {
//   //               alert("Lỗi Server");
//   //               window.location.reload();
//   //             }
//   //           });
//   //       }
//   //     }
//   //   }
//   // };
//   const handleSendMess = () => {
//     if (texting === '') {messagesGroups
//       Alert.alert("Please enter a message");
//       return;
//     } else if (!groupID) {
//       Alert.alert("Không thể tìm thấy phòng bạn muốn gửi tin nhắn");
//       return;
//     } else {
//       setIsActive(true);
//       if (sendFile.length > 0) {
//         const formData = new FormData();
//         formData.append('file', sendFile[0].file);

//         createMessagesFile(formData)
//           .then((resFile) => {
//             const data1 = {
//               content: resFile.data,
//               groupsID: groupID,
//             };

//             createMessagesGroup(data1)
//               .then((res) => {
//                 setTexting("");
//                 setSendFile([]);
//                 if (res.data.status === 400) {
//                   Alert.alert("Bạn và người này không còn là bạn nên không thể nhắn tin cho nhau");
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
//         formData1.append('file', sendImage[0].file);

//         createMessagesFile(formData1)
//           .then((resFile) => {

//             const data2 = {
//               content: resFile.data,
//               groupsID: groupID,
//             };
//             createMessagesGroup(data2)
//               .then((res) => {
//                 setTexting("");
//                 setSendImage([]);
//                 if (res.data.status === 400) {
//                   Alert.alert("You and this person are no longer friends so you cannot message each other");

//                 }
//                 setTimeout(() => {
//                   setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//                 }, 300);
//                 console.log("tin nhắn dc gửi thành công",res.data);

//               })
//               .catch((err) => {
//                 if (err.status === 400) {
//                   Alert.alert("Server error");

//                 }

//               })
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//            } else {
//           const data = {
//             content: texting,
//             groupsID: groupID,
//           };
//           createMessagesGroup(data)
//             .then((res) => {
//               setTexting("");

//               if (res.data.status === 400) {
//                 alert("Hiện tại bạn không còn trong nhóm này");
//                 window.location.reload();
//               }
//               setTimeout(() => {
//                 setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
//               }, 300);
//             })
//             .catch((err) => {
//               if (err.status === 400) {
//                 alert("Lỗi Server");
//                 window.location.reload();
//               }
//             });
//         }
//       }
//     }
  

//   const [clickedMessageFeedBackOb, setClickedMessageFeedBackOb] =
//     useState(undefined);
//   const handleFeedBackOb = (messageId) => {
//     ScrollbarCuoi();
//     setClickedMessageFeedBackOb(messageId);
//   };

//   let settime = null;

//   useEffect(() => {
//     clearTimeout(settime);
//   }, [texting]);
//   useEffect(() => {
//     let timer;
//     if (clickedMessage) {
//       timer = setTimeout(() => {
//         setClickedMessage(null);
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [clickedMessage]);
//   const SendToMesageImage = (mm) => {
//     if (
//       mm.endsWith(".jpg") ||
//       mm.endsWith(".png") ||
//       mm.endsWith(".jpeg") ||
//       mm.endsWith(".gif") ||
//       mm.endsWith(".tiff") ||
//       mm.endsWith(".jpe") ||
//       mm.endsWith(".jxr") ||
//       mm.endsWith(".tif") ||
//       mm.endsWith(".bmp")
//     ) {
//       return <Image source={{ uri: mm }} style={{ width: 150, height: 150 }} />;
//     } else if (mm.endsWith(".docx")) {
//       return (
//         <TouchableOpacity onPress={() => Linking.openURL(mm)}>
//           <Image
//             source={{
//               uri: "https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain",
//             }}
//             style={{ width: 80, height: 80 }}
//           />
//         </TouchableOpacity>
//       );
//     } else if (mm.endsWith(".pdf")) {
//       return (
//         <TouchableOpacity onPress={() => Linking.openURL(mm)}>
//           <Image
//             source={{
//               uri: "https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0",
//             }}
//             style={{ width: 80, height: 80 }}
//           />
//         </TouchableOpacity>
//       );
//     } else if (mm.endsWith(".rar")) {
//       return (
//         <TouchableOpacity onPress={() => Linking.openURL(mm)}>
//           <Image
//             source={{
//               uri: "https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg",
//             }}
//             style={{ width: 80, height: 80 }}
//           />
//         </TouchableOpacity>
//       );
//     } else if (mm.endsWith(".mp4")) {
//       return <Video source={{ uri: mm }} style={{ width: 300, height: 300 }} />;
//     } else {
//       return <Text>{mm}</Text>;
//     }
//   };

//   const [requestSent, setRequestSent] = useState(false);

//   const handleEditMessage = () => {
//     setShowOptions(false); // Đóng options sau khi thực hiện hành động
//   };
//   const scrollToBottom = () => {
//     if (messRef.current) {
//       messRef.current.scrollToEnd({ animated: true });
//     }
//   };

//   useEffect(() => {
//     if (!isPressing) {
//       scrollToBottom();
//     }
//   }, [messagesGroups, isPressing]);

//   const handlePressOnMessageScreen = () => {
//     setIsPressing(true);
//     setTimeout(() => {
//       setIsPressing(false);
//     }, 1000); // Reset isPressing state after 1 second
//   };
// //xóa tin nhắn , thu hồi tin nhắn
//   const handleDeleteMessage = (messageId) => {
//     const idLastMess = messagesGroups.slice(-1)[0]
//     const dataDeleteMessages = {
//         idMessages: messageId,
//         idLastMessageSent: idLastMess._id,
//     }
//     deleteMessagesGroups(groupID, dataDeleteMessages)
//         .then((res) => {
//             if (res.data.response === "Bạn không phải là chủ tin nhắn") {
//                 alert("Bạn không phải chủ tin nhắn nên không thể xóa")
//             }
//             if (res.status !== 200) {
//                 alert("Không thể xóa được tin nhắn")
//                 window.location.reload();
//                 return;
//             }
//         })
//         .catch((err) => {
//             alert("Lỗi hệ thống")
//         })
// };

// const messageRemoved = (content) => {
//     if (content === "") {
//         return "Tin nhắn đã được thu hồi"
//     }
//     else {
//         return content;
//     }
// }

//   const handleShowOptions = (index) => {
//     TextInput;
//     // Nếu đã mở rồi thì đóng lại
//     if (selectedMessageIndex === index && showOptions) {
//       setShowOptions(false);
//       setSelectedMessageIndex(null); // Đặt lại selectedMessageIndex về null
//     } else {
//       setSelectedMessageIndex(index);
//       setShowOptions(true);
//     }
//   };

//   const handleFileChangeImage = async () => {
//     try {
//       const file = await FilePicker.getDocumentAsync({
//         // multiple: true,
//         copyToCacheDirectory: true,
//         // type
//       });
//       // console.log(file.assets[0])

//       setTexting(file.assets[0].name);
//       setSendImage(file.assets);
//     } catch (error) {
//       console.error("Lỗi khi chọn file:", error);
//     }
//   };
//   const handleFileChange = async () => {
//     try {
//       const file = await FilePicker.getDocumentAsync({
//         // multiple: true,
//         copyToCacheDirectory: true,
//         // type
//       });
//       // console.log(file.assets[0])

//       setTexting(file.assets[0].name);
//       setSendFile(file.assets);
//     } catch (error) {
//       console.error("Lỗi khi chọn file:", error);
//     }
//   };

//   const handleTexting = (text) => {
//     setTexting(text);
//   };

//   const [isTyping, setIsTyping] = useState(false);
//   const handleChange = (e) => {
//     const newTexting = e.target.value;
//     setTexting(newTexting);
//     handleTexting(newTexting);
//   };

//   //button chuyển sang màn hình menu của nhóm
//   const handleSettingGroups = () => {
//     nav.navigate("ItemMenuGroups", {
//       groupID: groupID,
//       participants: participants,
//     });
//   };

// //  console.log('====================================');
// //  console.log("thanh vien",messagesGroups);
// //  console.log('====================================');
// useEffect(()=>{
// console.log(messagesGroups);
// })


const timeChat = (dataTime) => {
  const time = dataTime.substring(11, 16);
  return time;
}
useEffect(() => {
  
  
  if (group === undefined) {
      return;
  }
  setUpdateImageGroup(group.avtGroups)
  if (user.email === group.creator.email) {
      setLeader(true)
  } else {
      setLeader(false)
  }
  const GroupMessages = {
      groupId: group._id
  }
  getGroupsMessages(GroupMessages)
      .then((data) => {
          setMessagesGroups(data.data);
          setParticipants(group.participants)
         
      })
      .catch((err) => {
          console.log(err);
      })
      getListRooms()
      .then(res => {
          const roomsWithFriends = res.data.filter(room => room.friend === true);
          // Cập nhật state với các phòng đã lọc
          setFriendGroup(roomsWithFriends);
 
      })
      .catch(err => {
          console.log(err);
          console.log("Đã rơi zô đây");
      })
}, [group])
useEffect(() => {
  if (group === undefined) {
      return;
  }
  socket.on('connected', () => console.log('Connected'));
  socket.on(`leaveGroupsId${group._id}`, (data) => {
      if (data.userLeave !== user.email) {
          setParticipants(data.groupsUpdate.participants)
      }
      
  })
  socket.on(group._id, (data) => {
      setMessagesGroups(prevMessages => [...prevMessages, data.message])
  })
  socket.on(`emojiGroup${group._id}`, data => {
      setMessagesGroups(prevMessagesGroup => {
          return prevMessagesGroup.map(message => {
              if (message === undefined || data.messagesUpdate === undefined) {
                  return message;
              }
               if (message._id === data.messagesUpdate._id) {

                  return data.messagesUpdate;
              }
              return message;
          })
      })
  })
  socket.on(`deleteMessageGroup${group._id}`, (data) => {
      if (data) {
          // Loại bỏ tin nhắn bằng cách filter, không cần gói trong mảng mới
          setMessagesGroups(prevMessages => prevMessages.filter(item => item._id !== data.idMessages));

      }
  }) 
  socket.on(`recallMessageGroup${group._id}`, data => {
      if (data) {
          setMessagesGroups(preMessagesGroups=> {
          return preMessagesGroups.map(message => {
              if (message === undefined || data.messagesGroupUpdate === undefined) {
                  return message;
              }
              if (message._id === data.messagesGroupUpdate._id) {

                  return data.messagesGroupUpdate;
              }
              return message;
              })
          })
      }
      
  })
  socket.on(`attendGroup${group._id}`, (data) => {
      if (data) {
         setParticipants(data.groupsUpdate.participants) 
      }
      
  })
  socket.on(`feedBackGroup${group._id}`, (data) => {
      setMessagesGroups(prevMessages => [...prevMessages, data.message])
  })
  socket.on(`kickOutGroup${group._id}` , (data) => {
      setParticipants(data.groupsUpdate.participants)
  })
  return () => {
      
      socket.off(`leaveGroupsId${group._id}`)
      socket.off(group._id)
      socket.off(`emojiGroup${group._id}`)
      socket.off(`deleteMessageGroup${group._id}`)
      socket.off(`recallMessageGroup${group._id}`)
      socket.off(`attendGroup${group._id}`)
      socket.off(`feedBackGroup${group._id}`)
      socket.off(`kickOutGroup${group._id}`)
  }
},[socket, group])
useEffect(() => {
  socket.on('connected', () => console.log('Connected'));
  socket.on(`updateAcceptFriendsGroups${user.email}`, data => {
      if (data) {
          setFriendGroup(prevGroups => [...prevGroups, data])
         //console.log(data);
      }
  })
  socket.on(`updateUnFriendsGroups${user.email}`, data => {
      if (data) {
          setFriendGroup(prevGroups => prevGroups.filter(item => item._id !== data.roomsUpdate))
      }
  })
  return () => {
      socket.off('connected');
      socket.off(`updateAcceptFriendsGroups${user.email}`)
     socket.off(`updateUnFriendsGroups${user.email}`)
  }
}, [socket])
const setTingNameGroups = (group) => {
  if (group.nameGroups === '') {
      return `Groups của ${group.creator.fullName}`
  } else {
      return group.nameGroups;
  }
}
const messRef = useRef();
const ScrollbarCuoi = () => {
  const scroll = messRef.current;
  if (scroll) {
      scroll.scrollTop = scroll.scrollHeight;
  }
};
useEffect(() => {
  setTimeout(() => {
      ScrollbarCuoi();
  }, 500)

}, [messagesGroups]);
const handleButtonClick = () => {
  if (thuNhoBaRef.current.style.width === '100%') {
      thuNhoBaRef.current.style.width = '64%';
      thuNhoBonRef.current.style.width = '36%';
  }
  else {
      thuNhoBaRef.current.style.width = '100%';
      thuNhoBonRef.current.style.width = '0';
  }

}
  const handleTexting = (text) => {
    setTexting(text);
  };

const [isTyping, setIsTyping] = useState(false);
const handleChange = (e) => {
  const newTexting = e.target.value;
  setTexting(newTexting);
  handleTexting(newTexting);

};

 const handleSendMess = () => {
  console.log(group._id);
  if (texting === '') {
      alert("Mời bạn nhập tin nhắn");
      return;
  }
  else if (!group._id) {
      alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
      return;
  }
  else {
      // feedback
      setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
      if (sendFile.length > 0) {
          const formData = new FormData();
          formData.append('file', sendFile[0]);
          createMessagesFile(formData)
              .then((resFile) => {
                  if (clickedMessageFeedBackOb) {
                      const dataGroupsMessages= {
                          content: resFile.data,
                          idMessages: clickedMessageFeedBackOb._id,
                      };
                      createMessagesGroupFeedBack(group._id,dataGroupsMessages)
                      .then((res) => {
                          setTexting("");
                          setSendFile([]);
                          ScrollbarCuoi();
                          setClickedMessageFeedBackOb(undefined)
                          if (res.data.status === 400) {
                              alert("Hiện tại bạn không còn trong nhóm này")
                              window.location.reload();
                          }
                          setTimeout(() => {
                              setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                          }, 300);
                          //console.log(res.data);
                      })
                      .catch((err) => {
                          if (err.status === 400) {
                              alert("Lỗi Server")
                              window.location.reload();
                          }


                      })
                  } else {
                      const data1 = {
                          content: resFile.data,
                          groupsID: group._id,
                      };
                      createMessagesGroup(data1)
                      .then((res) => {
                          setTexting("");
                          setSendFile([]);
                          ScrollbarCuoi();
                          if (res.data.status === 400) {
                              alert("Hiện tại bạn không còn trong nhóm này")
                              window.location.reload();
                          }
                          setTimeout(() => {
                              setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                          }, 300);
                          //console.log(res.data);
                      })
                      .catch((err) => {
                          if (err.status === 400) {
                              alert("Lỗi Server")
                              window.location.reload();
                          }


                      })
                  }
              })
              .catch((err) => {
                  console.log(err);
              })

      }
      else if (sendImage.length > 0) {
          const formData1 = new FormData();
          formData1.append('file', sendImage[0]);
          createMessagesFile(formData1)
              .then((resFile) => {
                  if (clickedMessageFeedBackOb) {
                      const dataMessagesGroups2 = {
                          content: resFile.data,
                          idMessages: clickedMessageFeedBackOb._id,
                      };
                      createMessagesGroupFeedBack(group._id,dataMessagesGroups2)
                      .then((res) => {
                          setTexting("");
                          setSendImage([]);
                          ScrollbarCuoi();
                          setClickedMessageFeedBackOb(undefined)
                          if (res.data.status === 400) {
                              alert("Hiện tại bạn không còn trong nhóm này")
                              window.location.reload();
                          }
                          setTimeout(() => {
                              setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                          }, 300);
                          //console.log(res.data);
                      })
                      .catch((err) => {
                          if (err.status === 400) {
                              alert("Lỗi Server")
                              window.location.reload();
                          }
                      })
                  } else {
                      const data2 = {
                          content: resFile.data,
                          groupsID: group._id,
                      };
                      createMessagesGroup(data2)
                          .then((res) => {
                              setTexting("");
                              setSendImage([]);
                              ScrollbarCuoi();
                              if (res.data.status === 400) {
                                  alert("Hiện tại bạn không còn trong nhóm này")
                                  window.location.reload();
                              }
                              setTimeout(() => {
                                  setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                              }, 300);
                              //console.log(res.data);
                          })
                          .catch((err) => {
                              if (err.status === 400) {
                                  alert("Lỗi Server")
                                  window.location.reload();
                              }


                          })
                  }
                  
              })
              .catch((err) => {
                  console.log(err);
              })

      }
      else {
          if (clickedMessageFeedBackOb) {
              const dataMessagesGroups3 = {
                  content: texting,
                  idMessages: clickedMessageFeedBackOb._id,
              };
              createMessagesGroupFeedBack(group._id,dataMessagesGroups3)
              .then((res) => {
                  
                  setTexting("");
                  ScrollbarCuoi();
                  setClickedMessageFeedBackOb(undefined)
                  if (res.data.status === 400) {
                      alert("Hiện tại bạn không còn trong nhóm này")
                      window.location.reload();
                  }
                  setTimeout(() => {
                      setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                  }, 300);
                  //console.log(res.data);
              })
              .catch((err) => {
                  if (err.status === 400) {
                      alert("Lỗi Server")
                      window.location.reload();
                  }


              })
          } else {
              const data = {
                  content: texting,
                  groupsID: group._id,
              };
              createMessagesGroup(data)
                  .then((res) => {
                      setTexting("");
                      
                      if (res.data.status === 400) {
                          alert("Hiện tại bạn không còn trong nhóm này")
                          window.location.reload();
                      }
                      setTimeout(() => {
                          setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                      }, 300);
                      
                  })
                  .catch((err) => {
                      if (err.status === 400) {
                          alert("Lỗi Server")
                          window.location.reload();
                      }


                  })
          }
      }
  }


 }


let settime = null;

useEffect(() => {

  clearTimeout(settime);



}, [texting]);

const handleKeyDown = (e) => {
  // socket.emit(`onUserTyping`, { groupsId: group._id, phoneNumber: user.phoneNumber })
};
const [like, setLike] = useState(null);
const handleMouseEnter = (messageId) => {
  setHoveredMessage(messageId);
  setLike(messageId)
};
const handleMouseLeave = () => {
  setHoveredMessage(null);
  setChangeText(null)
  setLike(null)
};


const handleThreeClick = (messageId) => {
  setHoveredMessage(null);
  setClickedMessage(messageId);
}

const handleDelete = (messageId) => {
  const idLastMess = messagesGroups.slice(-1)[0]
  const dataDeleteMessages = {
      idMessages: messageId,
      idLastMessageSent: idLastMess._id,
  }
  deleteMessagesGroups(group._id, dataDeleteMessages)
      .then((res) => {
          if (res.data.response === "Bạn không phải là chủ tin nhắn") {
              alert("Bạn không phải chủ tin nhắn nên không thể xóa")
          }
          if (res.status !== 200) {
              alert("Không thể xóa được tin nhắn")
              window.location.reload();
              return;
          }
      })
      .catch((err) => {
          alert("Lỗi hệ thống")
      })
};


const messageRemoved = (content) => {
  if (content === "") {
      return "Tin nhắn đã được thu hồi"
  }
  else {
      return content;
  }
}



const handleUndo = (messageId) => {
  const messageToEdit = messagesGroups.find(message => message._id === messageId);
  if (messageToEdit.content === "") {
      alert("Tin nhắn đã được thu hồi")
  } else {
      const idLastMess = messagesGroups.slice(-1)[0];
   const dataUpdateMessage = {
       idMessages: messageId,
       idLastMessageSent: idLastMess._id,
       email: user.email,
   };
   recallMessagesGroups(group._id, dataUpdateMessage)
       .then(res => {
           if (res.data.response === "Bạn không phải là chủ tin nhắn") {
               alert("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
               return;
           }
           if (res.status !== 200) {
               alert("Không thể cập nhật được tin nhắn")
               window.location.reload();
               return;
           }
           // Cập nhật trạng thái của hoveredMessage và changeText
           setHoveredMessage(null);
           setChangeText(null);
       })
       .catch(err => {
           alert("Lỗi hệ thống")
       });
  
  }
   // Nếu ô input không rỗng, thực hiện cập nhật tin nhắn
   

};
const handleChangeText = (e) => {

  setEditedMessage(e.target.value);
};
// Hàm xử lý khi nhấn nút "Submit"
const changeTextButton = (messageId) => {

 

  // Đặt các biến state khác như trước
};



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
      return <img src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img>
  }
  else if (mm.endsWith('.docx')) {
      return <a href={mm}> <img src='https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.pdf')) {
      return <a href={mm}> <img src='https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.rar')) {
      return <a href={mm}> <img src='https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.mp4')) {
      return <video src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} onClick={(e) => { e.preventDefault(); e.target.paused ? e.target.play() : e.target.pause(); }} controls></video>

  }
  else if (mm.endsWith('.xlsx')) {
      return <a href={mm}> <img src='https://tse2.mm.bing.net/th?id=OIP.U0CtQVB5bE_YEsKgokMH4QHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.txt')) {
      return <a href={mm}> <img src='https://tse4.mm.bing.net/th?id=OIP.kf6nbMokM5UoF7IzTY1C5gHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.startsWith('https:')) {
      return <a href={mm}><p> {mm}</p></a>
  }
  else {
      return <p>{mm}</p>;
  }
}
// const SetFiends = () => {
//     // if (friend ) {

//     // }
//     console.log(friend);
// }
const formRefF = useRef(null);
const handleButtonClickF = () => {
  if (formRefF.current.style.display === 'none') {

      formRefF.current.style.display = 'flex';
  } else {

      formRefF.current.style.display = 'none';
  }
};
const btnClose = () => {
  formRefF.current.style.display = 'none';
}
const fileInputRef = useRef(null);
const fileInputRefImage = useRef(null);
const handleSend = () => {

  fileInputRef.current.click();
};

const handleSendImage = () => {

  fileInputRefImage.current.click();
};

const handleFileChange = (event) => {
  fileInputRef.current.click();
  // const file = event.target.files[0];
  // if (file) {

  //     setTexting(file.name);
  // }
  // const files = event.target.files;
  // setSendFile(files);
};
const handleFileChangeImage = (event) => {
  const file = event.target.files[0];
  if (file) {

      setTexting(file.name);
  }
  const files = event.target.files;
  setSendImage(files);
};


const handleSendIcon = (icon) => {
  setTexting(prev => prev + icon);
  // setShowIcons(false); // Ẩn danh sách biểu tượng sau khi chọn
};

const handleSendIconMess = (icon, messageId) => {
  //xu ly o day
  setShowIcons(false);
  const idLastMess = messagesGroups.slice(-1)[0];
  const dataUpdateEmoji = {
      newEmoji: icon,
      idMessages: messageId,
      idLastMessageSent: idLastMess._id,
      email: user.email,
  };

  updateEmojiGroup(group._id, dataUpdateEmoji)
      .then((res) => {
          //console.log(res.data);
      })
      .catch((error) => {
          console.log(error);
      })
};
const [showIconsMess, setShowIconsMess] = useState(null);
const iconsmess = ['👍', '❤️', '😄', '😍', '😞', '😠'];
const [hoveredIcon, setHoveredIcon] = useState(null);
const handleIconHover = (icon) => {
  setHoveredIcon(icon);
};
const handleIconLeave = () => {
  setHoveredIcon(null);
};

const iconsRef = useRef(null);

// useEffect(() => {
//   function handleClickOutside(e) {
//       if (iconsRef.current && !iconsRef.current.contains(e.target)) {
//           setShowIcons(false);
//       }
//   }
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => {

//       document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [iconsRef]);
const [leader, setLeader] = useState(false)
const handleExitRom = () => {
  
}
// Giải tán
const handleDissolution = () => {
  const data = {
      groupId: group._id
  }
  deleteGroup(data.groupId)
  .then((res) => {
      if(res.data.creator.email)
      {
          alert("Giải tán nhóm thành công")
      } else {
          alert("Giải tán phòng không thành công")
      }
      
  })
  .catch((err) => {
      console.log(err);
      alert("Lỗi hệ thống");
  })
}
const handleLeaveGroup = () => {
  const data = {
      groupId: group._id
  }
  leaveGroup(data)
  .then((res) => {
      if (res.data.message === "Bạn là chủ phòng bạn không thể rời đi") {
          alert(res.data.message);
      } else if(res.data.status === 400) {
          alert("Rời phòng không thành công")
      } else {
          
          setParticipants(res.data.groupsUpdate.participants)
          alert("Rời phòng thành công")
      }
  })
  .catch((err) => {
      console.log(err);
      alert("Lỗi Server")
  })
}
const formRefAddMember = useRef(null);
const handAddMember = () => {
  if (formRefAddMember.current.style.display === 'none') {
      const joinedFriends = participants.map(m => m.phoneNumber);
      setJoinedFriends(joinedFriends);
      formRefAddMember.current.style.display = 'flex';
  } else {

      formRefAddMember.current.style.display = 'none';
  }
};
const btnCloseAddMember = () => {
  setSelectedItems([]);
  formRefAddMember.current.style.display = 'none';
}
const [selectedItems, setSelectedItems] = useState([]);
const [joinedFriends, setJoinedFriends] = useState([]);

const handleCheckboxChange = (event) => {
  const { value, checked } = event.target;
  if (checked) {
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, value]);
  } else {
      setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== value));
  }
};
const addMember = () => {
  const data = {
      participants: selectedItems,
      groupId: group._id,
  }
  attendGroup(data)
  .then((res) => {
      if(res.data.groupsUpdate) {
          formRefAddMember.current.style.display = 'none';
          setSelectedItems([])
          alert("Thêm thành viên thành công")
          res.data.userAttends.forEach((item) => {
              const data2 = {
                  content: `${user.fullName} đã mời ${item.fullName} vào nhóm`,
                  groupsID: group._id,
              };
              createMessagesGroup(data2)
                  .then((res) => {
                      setTexting("");
                      setSendImage([]);
                      ScrollbarCuoi();
                      if (res.data.status === 400) {
                          alert("Hiện tại bạn không còn trong nhóm này")
                          window.location.reload();
                      }
                      setTimeout(() => {
                          setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                      }, 300);
                      //console.log(res.data);
                  })
                  .catch((err) => {
                      if (err.status === 400) {
                          alert("Lỗi Server")
                          window.location.reload();
                      }


                  })
          })
          
      }
      else {
          alert("Bạn không còn là thành viên trong nhóm")
          window.location.reload();
      }
  })
  .catch((err) => {
      console.log(err);
      alert("Lỗi hệ thống")
  })
}
const [clickedMessageFeedBackOb, setClickedMessageFeedBackOb] = useState(undefined);
const handleFeedBackOb = (messageId) => {
  ScrollbarCuoi()
  setClickedMessageFeedBackOb(messageId);
}
const [showMember, setShowMember] = useState(false)

const checkAnswerMessage = (mm) => {
  if (mm.endsWith('.jpg') || mm.endsWith('.png') || mm.endsWith('.jpeg') || mm.endsWith('.gif') || mm.endsWith('.tiff') || mm.endsWith('.jpe') || mm.endsWith('.jxr') || mm.endsWith('.tif') || mm.endsWith('.bmp')) {
      return <img src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img>
  }
  else if (mm.endsWith('.docx')) {
      return <a href={mm}> <img src='https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.pdf')) {
      return <a href={mm}> <img src='https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.rar')) {
      return <a href={mm}> <img src='https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.mp4')) {
      return <video src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} onClick={(e) => { e.preventDefault(); e.target.paused ? e.target.play() : e.target.pause(); }} controls></video>

  }
  else if (mm.endsWith('.xlsx')) {
      return <a href={mm}> <img src='https://tse2.mm.bing.net/th?id=OIP.U0CtQVB5bE_YEsKgokMH4QHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.endsWith('.txt')) {
      return <a href={mm}> <img src='https://tse4.mm.bing.net/th?id=OIP.kf6nbMokM5UoF7IzTY1C5gHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
  }
  else if (mm.startsWith('https:')) {
      return <a href={mm}><p> {mm}</p></a>
  }
  else {
      return <p>{mm}</p>;
  }
}
const settingUsers = (data) => {
  if (data.creator.email === user.email) {
      return data.recipient;
  } else {
      return data.creator;
  }
}    
const [inforMember, setInforMember] = useState(undefined)

const [searchValue, setSearchValue] = useState('');
const handleSearchChange = (e) => {
  setSearchValue(e.target.value);
};
const filteredFriends = friendsGroup.filter(m => {
  return settingUsers(m).fullName.toLowerCase().includes(searchValue.toLowerCase());
});
// kick grouos
const onClickKick = (id) => {
  const data = {
      idGroups: group._id,
      idUserKick: id,
  }
  kickGroups(data)
  .then((res) => {
      if (res.data.groupsUpdate) {
          const data1 = {
              content: `Đã mời ${res.data.userKicked} ra khỏi nhóm`,
              groupsID: res.data.groupsUpdate._id,
          };
          createMessagesGroup(data1)
          .then((res) => {
              setTexting("");
              ScrollbarCuoi();
              if (res.data.status === 400) {
                  alert("Hiện tại bạn không còn trong nhóm này")
                  window.location.reload();
              }
              setTimeout(() => {
                  setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
              }, 300);
              //console.log(res.data);
          })
          .catch((err) => {
              if (err.status === 400) {
                  alert("Lỗi Server")
                  window.location.reload();
              }


          })
      } else {
         alert('Kick thành viên không thành công') 
      }
      
  })
  .catch((err) => {
      console.log(err);
      alert("Lỗi hệ thống")
  })
}
const [nameGroup, setNameGroup] = useState('')
const handleUpdateInf = (e) => {
  setNameGroup(e.target.value);
};
const refUpdateInf = useRef(null)
const [updateImageGroup, setUpdateImageGroup] = useState()
const handleImageChange = (event) => {
  const file = event.target.files[0];
  const files = event.target.files;
  if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
          setUpdateImageGroup(file);
      };
      reader.readAsDataURL(file);
  } else {
      alert("Vui lòng chọn một tập tin ảnh.");
  }
};
// update Group
const updateInfoGroups = () => {
  console.log(updateImageGroup);
  console.log(nameGroup);
}
const clickOpenUpdate = () => {
  if (refUpdateInf.current.style.display === 'none') {

      refUpdateInf.current.style.display = 'flex';
  } else {

      refUpdateInf.current.style.display = 'none';
  }
};
const clickCloseUpdate = () => {

  refUpdateInf.current.style.display = 'none';

};
  //button chuyển sang màn hình menu của nhóm
  const handleSettingGroups = (group) => {
    nav.navigate("ItemMenuGroups", { group });
  };
const handlePressOnMessageScreen =()=>{

}
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
            <Image source={ updateImageGroup} style={styles.itemImage} />
             <Text style={styles.itemName}>{setTingNameGroups(group)}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <FontAwesome name="video-camera" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => handleSettingGroups(group)}
            >
              <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView ref={messRef} style={styles.messageContent} onTouchStart={handlePressOnMessageScreen}>
  {/* Hiển thị tin nhắn */}
  {messagesGroups.map((message, index) => (
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
          <TouchableOpacity
            style={styles.fileButton}
            onPress={handleFileChange}
          >
            <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files[0];
  if (file) {

      setTexting(file.name);
  }
  const files = event.target.files;
  setSendFile(files);
        }}
      />
            <Ionicons name="document-attach-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fileButton}
            onPress={handleFileChange}
          >
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
const headerHeight = Platform.OS === "ios" ? 80 : 56;
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
    height: headerHeight, // Sử dụng headerHeight thay vì giá trị cứng
  },
  goBackButton: {
    marginRight: 10, // Khoảng cách giữa nút quay lại và nội dung header
  },
  headerContent: {
    flexDirection: "row", // Thay đổi thành column
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
    flexDirection: "row",
    marginVertical: 5,
    //maxWidth: "80%",
    marginTop: 5,
  },
  messageContainerReceiver: {
    backgroundColor: "silver",
    marginTop: 5,
    borderRadius: 10,
    maxWidth: "50%",
    padding: 10,
    alignSelf: "flex-start", // Căn giữa theo chiều ngang
  },
  messageContainerAuthor: {
    backgroundColor: "#ffa500",
    marginTop: 5,
    borderRadius: 10,
    maxWidth: "50%",
    padding: 10,
    alignSelf: "flex-end", // Căn giữa theo chiều ngang
  },
  messageAuthor: {
    alignSelf: "flex-end",
  },
  messageReceiver: {
    alignSelf: "flex-start",
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
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20
  },
});

export default MessageGroup;
