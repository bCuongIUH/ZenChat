import React, { useState, useEffect, useContext ,useRef} from "react";
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
import { getListRooms, getListGroups, deleteRooms,unFriendsUser } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import { SocketContext } from "../../untills/context/SocketContext";
import { useRoute } from '@react-navigation/native';


export const Chatpage = () => {
  const route = useRoute();
  const { user } = useContext(AuthContext);
  const nav = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [isFriendActionModalVisible, setFriendActionModalVisible] = useState(false);
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
  const [isChatSingle, setIsChatSingle] = useState(true); 

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
  const settingUsers = (data) => {
    if (data.creator.email === user.email) {
        return data.recipient;
    } else {
        return data.creator;
    }
}

  const setTingNameGroups = (group) => {
    if (group.nameGroups === '') {
        return `Groups của ${group.creator.fullName}`
    } else {
        return group.nameGroups;
    }
}
const getDisplayLastMessagesGroups = (messages) => {
  const message = "";
  if (messages.lastMessageSent === undefined || messages.lastMessageSent.content === undefined) {
      return message;
  }

  else if (messages.lastMessageSent.content.endsWith('.jpg') || messages.lastMessageSent.content.endsWith('.png') || messages.lastMessageSent.content.endsWith('.jpeg') || messages.lastMessageSent.content.endsWith('.gif') || messages.lastMessageSent.content.endsWith('.tiff') || messages.lastMessageSent.content.endsWith('.jpe') || messages.lastMessageSent.content.endsWith('.jxr') || messages.lastMessageSent.content.endsWith('.tif') || messages.lastMessageSent.content.endsWith('.tif')) {
      return "Send image";
  }
  else if (messages.lastMessageSent.content.endsWith('.docx') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.txt') || messages.lastMessageSent.content.endsWith('.xlsx')) {
      return "Send file";
  }
  else if (messages.lastMessageSent.content.endsWith('.mp4')) {
      return "Send video";
  }
  else {
      const message = messages.lastMessageSent.content;
      if (message === "") {
          return "Tin nhắn đã được thu hồi";
      }
      const lastMessage = `...${message.slice(-20)}`;
      return lastMessage;
  }

}

  socket.on(user.email, roomSocket => {
    updateListRooms(roomSocket.rooms)
});
  const handleGroupPress = (group) => {
    nav.navigate("MessageGroup", { group });
  };
 

  const friend = (userId) => {
    return user.friends.some((friend) => friend._id === userId);
  };
  
  // const handleTodoItemPress = (room)=>{
  //   nav.navigate("Messages",{room})
  //  }
 // chuyển màn hình
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
               // friend: existingRoom.friend,
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

                friend: friend(item._id),
                room : item 

              });
             
    }

  };
  
 
  

  

  useEffect(() => {
        
    socket.on(`updateLastMessages${user.email}`, lastMessageUpdate => {
        setRooms(prevRooms => {
            // Cập nhật phòng đã được cập nhật
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
            // Cập nhật phòng đã được cập nhật
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
                // Cập nhật phòng đã được cập nhật
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
  function handleMoreOptionsPress(user) {
    setSelectedUser(user);
    setIsFriend(friend(user._id));
    setFriendActionModalVisible(true);
  }
  const formRef = useRef(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  
  const selectFriend = (id) => {
    setSelectedFriendId(id);
  };



  const handleUnfriend = (id) => {
    
    const userReciever1 = { id: id };
    unFriendsUser(userReciever1)
      .then((resUser) => {
        if (resUser.data.emailUserActions) {
          setErrorMessage('Hủy kết bạn thành công');
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);

          const idP = { idRooms: resUser.data.roomsUpdate };
          const userAction = { id: user._id };
          deleteRooms(userAction.id, idP.idRooms)
            .then((resData) => {
              if (resData.data.creator) {
                console.log(resData.data);
                setErrorMessage('Huỷ kết bạn thành công');
                setShowErrorModal(true);
                setTimeout(() => {
                  setShowErrorModal(false);
                }, 2000);
              } else {
                setErrorMessage('Huỷ phòng không thành công');
                setShowErrorModal(true);
                setTimeout(() => {
                  setShowErrorModal(false);
                }, 2000);
              }
            })
            .catch((err) => {
              console.log(err);
              setErrorMessage('Lỗi hủy phòng');
              setShowErrorModal(true);
              setTimeout(() => {
                setShowErrorModal(false);
              }, 2000);
            });
        } else {
          setErrorMessage('Huỷ kết bạn không thành công');
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);
        }
      })
      .catch((error) => {
        setErrorMessage('Lỗi server');
        setShowErrorModal(true);
        console.log(error);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      });
    
  
    // setPhoneNumber('');
    // setAuthFound([]);
    if (formRef.current) {
      formRef.current.style.display = 'none';
    }
  };

  const [showErrorModal, setShowErrorModal] = useState(false) // Modal errr


  const [errorMessage, setErrorMessage] = useState('');
  const handleAcceptFriendRequest = (user) => {
    console.log("chấp nhận kết bạn thành công:", user);
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

    useEffect(() => {
        const fetchData = async () => {
            getListRooms()
                .then(res => {
                    // const filteredRooms = res.data.filter(room => room.lastMessageSent);

                    // Chỉ setRooms với các object đã được lọc
                    setRooms(res.data);
                    // Chỉ setRooms với các object đã được lọc
                    const roomsWithFriends = res.data.filter(room => room.friend === true);
                    // Cập nhật state với các phòng đã lọc
                    setFriendCreateGroup(roomsWithFriends);
           
                })
                .catch(err => {
                    console.log(err);
                    console.log("Đã rơi zô đây");
                })
        }
        fetchData();

    }, [])

useEffect(() => {
  if (searchStarted || searchText === "") {
    if (searchText === "") {
      setFilteredTodoList(todoList);
    } else {
      const filteredList = todoList.filter((item) =>
        item.fullName && typeof item.fullName === 'string' && item.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTodoList(filteredList);
    }
  }
}, [searchStarted, searchText, selectedFunction]);

// update list room
const updateListRooms = (updatedRoom) => {
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

//socket
useEffect(() => {
  socket.on('connected', () => console.log('Connected'));
  socket.on(`create ${user.email}`, roomSocket => {
      setRooms(prevRooms => [...prevRooms, roomSocket]);

  })
  socket.on(user.email, roomSocket => {
      updateListRooms(roomSocket.rooms)
  });
  socket.on(`createGroups${user.email}`, data => {
      setGroups(prevGroups => [...prevGroups, data])
  })
  socket.on(`deleteGroups${user.email}`, data => {
      setGroups(prevGroups => {
              return prevGroups.filter(item => item._id !== data._id)
      })
  })
  socket.on(`leaveGroups${user.email}`, data => {
      if (data.userLeave === user.email) {
           setGroups(prevGroups => {
              return prevGroups.filter(item => item._id !== data.groupsUpdate._id)
          })
      } else {
          setGroups(prevGroups => {
              const updatedGroups = prevGroups.map(room => {
                  if (room === undefined || data.groupsUpdate=== undefined) {
                      return room;
                  }
                  if (room._id === data.groupsUpdate._id) {
                      return data.groupsUpdate;
                  }
                  return room;
              });
              return updatedGroups;
          })
      }
     
  })
  socket.on(`unfriends${user.email}`, data => {
      if (data.reload === false) {
          setRooms(prevRooms => {
              // Cập nhật phòng đã được cập nhật
              return prevRooms.filter(item => item._id !== data.roomsUpdate)
          });  
          nav.navigate('Chatpage')
      }
      else {
          // alert(`Người dùng ${data.emailUserActions} đã hủy kết bạn`)
          setErrorMessage(`Người dùng ${data.emailUserActions} đã hủy kết bạn`);
          setShowErrorModal(true); // Hiển thị modal error

          setTimeout(() => {
              setShowErrorModal(false);
          }, 2000);
          setRooms(prevRooms => {
              // Cập nhật phòng đã được cập nhật
             return prevRooms.filter(item => item._id !== data.roomsUpdate)
          }); 
       nav.navigate('Chatpage')
      }
  })
  socket.on(`undo${user.email}`, data => {
      setRooms(prevRooms => {
          // Cập nhật phòng đã được cập nhật
         return prevRooms.filter(item => item._id !== data.roomsUpdate)
      });  
      nav.navigate('Chatpage')
  })
  //socket group
  socket.on(`createMessageGroups${user.email}`, (data) => {
      setGroups(prevGroups => {
          // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
          const filteredGroups = prevGroups.filter(item => item._id !== data.groups._id);
          return [data.groups, ...filteredGroups];
      });
  })
  socket.on(`deleteLastMessagesGroups${user.email}`, (data) => {
      setGroups(prevGroups => {
          // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
          const filteredGroups = prevGroups.filter(item => item._id !== data.groupsUpdate._id);
          return [data.groupsUpdate, ...filteredGroups];
      });
  })
  socket.on(`recallLastMessagesGroups${user.email}`, (data) => {
      if (data) {
          setGroups(prevGroups => {
              const updatedGroups = prevGroups.map(room => {
                  if (room === undefined || data.groupsUpdate=== undefined) {
                      return room;
                  }
                  if (room._id === data.groupsUpdate._id) {
                      return data.groupsUpdate;
                  }
                  return room;
              });
              return updatedGroups;
          })
      }
      
  })
  socket.on(`attendMessagesGroup${user.email}`, (data) => {
      if (data) {
          setGroups(prevGroups => {
              const updatedGroups = prevGroups.map(room => {
                  if (room === undefined || data.groupsUpdate=== undefined) {
                      return room;
                  }
                  if (room._id === data.groupsUpdate._id) {
                      return data.groupsUpdate;
                  }
                  return room;
              });
              return updatedGroups;
          })
      }
  })
  socket.on(`attendMessagesGroupsss${user.email}`, (data) => {
      if (data) {
          setGroups(prevGroups =>[data.groupsUpdate, ...prevGroups])
      }
  })
  socket.on(`feedBackLastMessagesGroup${user.email}`, (data) => {
      setGroups(prevGroups => {
          // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
          const filteredGroups = prevGroups.filter(item => item._id !== data.groups._id);
          return [data.groups, ...filteredGroups];
      });
  })
  socket.on(`updateKickGroup${user.email}`, data => {
      console.log(data);
      if (data.userKicked === user.email) {
          console.log(`Đã rơi vào 1 ${data.groupsUpdate._id}`);
           setGroups(prevGroups => {
              return prevGroups.filter(item => item._id !== data.groupsUpdate._id)
          })
      } else {
          console.log(`Đã rơi vào 2 ${data.groupsUpdate._id}`);
          setGroups(prevGroups => {
              const updatedGroups = prevGroups.map(room => {
                  if (room === undefined || data.groupsUpdate=== undefined) {
                      return room;
                  }
                  if (room._id === data.groupsUpdate._id) {
                      return data.groupsUpdate;
                  }
                  return room;
              });
              return updatedGroups;
          })
      }
     
  })
  return () => {
      socket.off('connected');
      socket.off(user.email);
      socket.off(user.email)
      socket.off(`createGroups${user.email}`)
  
  }
}, [])
    return (
      <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSearchIconPress}
          style={styles.searchIcon}
        >
          {isSearching ? (
            <AntDesign name="closecircleo" size={24} color="black" />
          ) : (
            <Ionicons name="search" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TextInput
          style={[styles.searchInput, isSearching && styles.searchInputActive]}
          placeholder="Tìm kiếm"
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={(text) => {
            setSearchStarted(true);
            setSearchText(text);
          }}
        />
        <TouchableOpacity
          onPress={handleAddFriendPress}
          style={styles.addFriendButton}
        >
          <Ionicons name="person-add-sharp" size={24} color="black" />
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
                  onPress={() => handleUnfriend(selectedFriendId)}
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
     
          const groupIDs = getDisplayGroup(item);
          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleGroupPress(item)}
            >
               <Image source={ item.avtGroups } style={styles.itemImage} />
              <Text style={styles.itemName}>{item.nameGroups}</Text>
        
            </TouchableOpacity>
          );
        } else {
         
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      //paddingTop: 20,
      height :80,
      backgroundColor: "#ff8c00",
    },
    container: {
      flex: 1,
      backgroundColor: "#fff",
   
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderRadius: 20,
      paddingHorizontal: 15,
      backgroundColor: "#f2f2f2",
      fontSize: 16,
      color: "black",
    },
    searchInputActive: {
      backgroundColor: "#fff",
    },
    addFriendButton: {
      marginLeft: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalcontent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 20,
      alignItems: "center",
    },
    modalOption: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#ff8c00",
      marginBottom: 20,
    },
    modalbtn: {
      width: "80%",
      paddingVertical: 15,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
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
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    itemStatus: {
      fontSize: 14,
      color: "gray",
    },
    menuView: {
      flexDirection: "row",
      height: 65,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
    },
    tabBarButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedButton: {
      color: "#ff8c00",
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      width: '100%', 
    
    // paddingHorizontal: 10, 
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
