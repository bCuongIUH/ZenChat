
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../untills/context/AuthContext";
import { createGroups, getListGroups } from "../../../untills/api";
import Checkbox from "expo-checkbox";
import { SocketContext } from "../../../untills/context/SocketContext";

const ItemAddGroup = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [nameGroups, setNameGroups] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [creatorName, setCreatorName] = useState("");//tên người tạo nhóm
  const socket = useContext(SocketContext);
  
  useEffect(() => {
    const friendsArray = Object.entries(user.friends).map(
      ([friendId, friendData]) => ({
        id: friendId,
        ...friendData,
        selected: false,
      })
    );
    setFriends(friendsArray);
  }, [user.friends]);

  const toggleCheckbox = (friendId, newValue) => {
    const updatedFriends = friends.map((friend) =>
      friend.id === friendId ? { ...friend, selected: newValue } : friend
    );
    setFriends(updatedFriends);

    const newSelectedItems = updatedFriends
      .filter((friend) => friend.selected)
      .map((friend) => friend.phoneNumber);
    setSelectedPhoneNumbers(newSelectedItems);
    setSelectedCount(newSelectedItems.length);
  };

  const handleAddGroup = () => {
    if (nameGroups.trim() === "") {
      alert("Vui lòng nhập tên nhóm.");
      return;
    }

    if (selectedPhoneNumbers.length < 2) {
      alert("Tạo nhóm cần chọn ít nhất 2 người bạn.");
      return;
    }

    const data = {
      participants: selectedPhoneNumbers,
      nameGroups: nameGroups,
    };


    createGroups(data)
      .then((res) => {
        alert("Tạo nhóm thành công.");
        setGroupId(res.data.id);
        setSelectedPhoneNumbers([]);
        setNameGroups(nameGroups);
       
        navigation.navigate("Chatpage", { createdGroup: res.data, group: nameGroups });//
      })
      .catch((error) => {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại sau.");
      });
  };


  
  // const handleAddGroup = () => {
  //   if (nameGroups.trim() === "") {
  //     alert("Vui lòng nhập tên nhóm.");
  //     return;
  //   }
  
  //   if (selectedPhoneNumbers.length < 2) {
  //     alert("Tạo nhóm cần chọn ít nhất 2 người bạn.");
  //     return;
  //   }
  
    
  //   const participants = [...selectedPhoneNumbers, user.phoneNumber]; 
  
  //   const data = {
  //     participants: participants, 
  //     nameGroups: nameGroups,
  //   };
  
  //   createGroups(data)
  //     .then((res) => {
  //       alert("Tạo nhóm thành công.");
  //       setGroupId(res.data.id);
  //       setSelectedPhoneNumbers([]);
  //       setNameGroups(nameGroups);
       
  //       navigation.navigate("Chatpage", { createdGroup: res.data, group: nameGroups });
  //     })
  //     .catch((error) => {
  //       Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại sau.");
  //     });
  // };
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     getListGroups()
  //       .then((res) => {
  //         setGroups(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         console.log("Đã rơi zô đây");
  //       });
  //   };
  //   fetchData();
  // }, []);

  //chọn ảnh
const handleChooseImage =()=>{
  
}


//socket
useEffect(() => {
  socket.on('connected', () => console.log('Connected'));
  socket.on(user.email, roomSocket => {
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
          navigate('Chatpage');
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
          navigate('Chatpage');
      }
  })
  socket.on(`undo${user.email}`, data => {
      setRooms(prevRooms => {
          // Cập nhật phòng đã được cập nhật
         return prevRooms.filter(item => item._id !== data.roomsUpdate)
      }); 
      navigate('Chatpage');
  })
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
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tạo nhóm</Text>
        <Text style={styles.selectedCount}>{selectedCount} chọn</Text>
      </View>
      <View style={{ padding: 20 }}>
        <View style={styles.groupNameContainer}>
          <TextInput
            style={styles.groupNameInput}
            placeholder="Đặt tên nhóm"
            value={nameGroups}
            onChangeText={(text) => setNameGroups(text)}
          />
          <TouchableOpacity   onPress={() => handleChooseImage()}>
            <MaterialIcons name="image" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text>Danh sách bạn bè:</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Checkbox
                value={item.selected}
                onValueChange={(newValue) => toggleCheckbox(item.id, newValue)}
              />

              <View style={styles.friendInfo}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.friendName}>{item.fullName}</Text>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleAddGroup}>
          <Text style={styles.createButtonText}>Tạo nhóm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCount: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  groupNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendName: {
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: "#ff8c00",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ItemAddGroup;
