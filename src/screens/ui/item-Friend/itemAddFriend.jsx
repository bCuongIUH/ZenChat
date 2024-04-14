// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { findAuth, createRooms, sendFriends } from "../../../untills/api";
// import { useUser } from "../../ui/component/findUser";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome, AntDesign } from "@expo/vector-icons";
// import { SocketContext } from "../../../untills/context/SocketContext";
// import { AuthContext } from "../../../untills/context/AuthContext";

// const ItemAddFriend = () => {
//   const { user } = useContext(AuthContext);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const { handleFindUser } = useUser();
//   const [authFound, setAuthFound] = useState([]);
//   const [isAddClicked, setIsAddClicked] = useState(false);
//   const navigation = useNavigation();
//   const socket = useContext(SocketContext);
//   const formRef = useRef(null);
//   const [rooms, setRooms] = useState([]);

//   const handleSearchChange = (text) => {
//     setPhoneNumber(text);
//   };

//   const handleFoundUser = async () => {
//     let data = phoneNumber;
//     if (phoneNumber.startsWith("0")) {
//       data = `(+84)${phoneNumber.slice(1)}`;
//     }
//     if (phoneNumber.startsWith("+84")) {
//       data = `(+84)${phoneNumber.slice(1)}`;
//     }
//     const result = await handleFindUser(data);

//     if (result !== undefined) {
//       setAuthFound([result]);
//     }
//   };

//   const handleAddClick = () => {
//     const message = "hello";
//     const authen = [authFound[0].email];
//     const email = authen[0];
//     const data1 = { email, message };

//     createRooms(data1)
//       .then((res) => {
//         if (res.data.message === "Đã tạo phòng với User này ròi") {
//           alert("Đã tạo phòng với User này ròi !!!");
//           return;
//         }
//         if (res.data.status === 400) {
//           alert("Không thể nhắn tin với chính bản thân mình !!!");
//           return;
//         } else {
//           // window.location.reload();
//           const idFriend = {
//             id: res.data.recipient._id,
//           };
//           sendFriends(idFriend)
//             .then((userRes) => {
//               console.log(userRes.data);
//               if (userRes.data) {
//                 if (formRef.current) {
//                   formRef.current.style.display = "none";
//                 }
//                 alert("Gửi lời mời kết bạn thành công");

//                 return;
//               } else {
//                 alert("Gửi lời mời kết bạn không thành công");
//                 return;
//               }
//             })
//             .catch((error) => {
//               console.log(error);
//               alert("Lỗi hệ thống");
//             });
//           const roomInfo = res.data.room;
//           socket.emit("newRoomCreated", roomInfo);
//           navigation.navigate("Chatpage", { roomInfo, user: authFound[0] });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         alert("Lỗi hệ thống");
//       });
//     setPhoneNumber("");
//     setAuthFound([]);
//   };

//   useEffect(() => {
//     console.log(typeof authFound);
//   }, [authFound]);


//   //update list rom qua phòng bên chatpage
//   useEffect(() => {
//     socket.on("connected", () => console.log("Connected"));
//     socket.on(user.email, (roomSocket) => {
//       setRooms((prevRooms) => [...prevRooms, roomSocket]);
//     });
//     socket.on(user.email, (roomSocket) => {
//       updateListRooms(roomSocket.rooms);
//     });

//     return () => {
//       socket.off("connected");
//       socket.off(user.email);
//       socket.off(user.email);
//     };
//   }, []);
//   useEffect(() => {
//     socket.on(`updateLastMessages${user.email}`, (lastMessageUpdate) => {
//       setRooms((prevRooms) => {
//         // Cập nhật phòng đã được cập nhật
//         return prevRooms.map((room) => {
//           if (room === undefined || lastMessageUpdate === undefined) {
//             return room;
//           }
//           if (room._id === lastMessageUpdate._id) {
//             return lastMessageUpdate;
//           }
//           return room;
//         });
//       });
//     });
//     socket.on(`updateLastMessagesed${user.email}`, (lastMessageUpdate) => {
//       setRooms((prevRooms) => {
//         // Cập nhật phòng đã được cập nhật
//         return prevRooms.map((room) => {
//           if (room === undefined || lastMessageUpdate === undefined) {
//             return room;
//           }
//           if (room._id === lastMessageUpdate._id) {
//             return lastMessageUpdate;
//           }
//           return room;
//         });
//       });
//     });
//     return () => {
//       socket.off(`updateLastMessages${user.email}`);
//       socket.off(`updateLastMessagesed${user.email}`);
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign name="arrowleft" size={24} color="black" />
          
//         </TouchableOpacity>
//       </View>

//       {/* Thanh tìm kiếm */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.input}
//           onChangeText={handleSearchChange}
//           placeholder="Nhập số điện thoại"
//           value={phoneNumber}
//         />
//         <TouchableOpacity onPress={handleFoundUser}>
//           <FontAwesome name="search" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Thông tin người dùng */}
//       {authFound.length > 0 && (
//         <View style={styles.userInfoContainer}>
//           <View style={styles.userInfo}>
//             <Image
//               source={{ uri: authFound[0].avatar }}
//               style={styles.avatar}
//             />
//             <View style={styles.textContainer}>
//               <Text style={styles.fullName}>{authFound[0].fullName}</Text>
//               <Text style={styles.phoneNumber}>
//                 PhoneNumber: {authFound[0].phoneNumber}
//               </Text>
//             </View>
//           </View>
//           {/* Nút thêm bạn và nút hủy */}
//           <View style={styles.buttonContainer}>
//             {!isAddClicked ? (
//               <TouchableOpacity onPress={handleAddClick}>
//                 <Text style={styles.addButton}>Thêm bạn</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={() => setIsAddClicked(false)}>
//                 <Text style={styles.cancelButton}>Cancel</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     //alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ff8c00",
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 10,
//     marginTop: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     backgroundColor: "white",
//     flex: 1,
//     marginRight: 10,
//   },
//   userInfoContainer: {
//     marginTop: 100,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   textContainer: {
//     marginLeft: 10,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   fullName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   phoneNumber: {
//     fontSize: 16,
//     color: "gray",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//   },
//   addButton: {
//     backgroundColor: "#ff8c00",
//     color: "white",
//     padding: 10,
//     borderRadius: 5,
//     textAlign: "center",
//     width: 100,
//     marginRight: 10,
//   },
//   cancelButton: {
//     backgroundColor: "#ff8c00",
//     color: "white",
//     padding: 10,
//     borderRadius: 5,
//     textAlign: "center",
//     width: 100,
//   },
// });

// export default ItemAddFriend;
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
  const navigation = useNavigation();
  const socket = useContext(SocketContext);
  const formRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(true); // Thêm state mới cho trạng thái của thanh tìm kiếm

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
          alert("Đã tạo phòng với User này ròi !!!");
          return;
        }
        if (res.data.status === 400) {
          alert("Không thể nhắn tin với chính bản thân mình !!!");
          return;
        } else {
          // window.location.reload();
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
                alert("Gửi lời mời kết bạn thành công");

                return;
              } else {
                alert("Gửi lời mời kết bạn không thành công");
                return;
              }
            })
            .catch((error) => {
              console.log(error);
              alert("Lỗi hệ thống");
            });
          const roomInfo = res.data.room;
          socket.emit("newRoomCreated", roomInfo);
          navigation.navigate("Chatpage", { roomInfo, user: authFound[0] });
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Lỗi hệ thống");
      });
    setPhoneNumber("");
    setAuthFound([]);
  };

  useEffect(() => {
    console.log(typeof authFound);
  }, [authFound]);

  useEffect(() => {
    // Fetch friend list logic here
    // const fetchedFriendList = ...
    // setFriendList(fetchedFriendList);
  }, []);

  // Function to show friend list
  const handleShowFriendList = () => {
    setShowSearchBar(true); // Show search bar when switching to friend list view
    setShowFriendList(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
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

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, { marginRight: 10 }]}
          onPress={() => setShowFriendList(false)}
        >
          <Text style={styles.optionText}>Tạo Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={handleShowFriendList}
        >
          <Text style={styles.optionText}>Danh sách bạn bè</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!showFriendList ? (
        // Current function
        authFound.length > 0 && (
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
            {/* Add friend button and cancel button */}
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
        )
      ) : (
        // Friend list
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  option: {
    padding: 10,
    backgroundColor: "#ff8c00",
    borderRadius: 5,
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
  },
  userInfoContainer: {
    marginTop: 20,
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
});

export default ItemAddFriend;
