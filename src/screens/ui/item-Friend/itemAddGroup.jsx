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
  CheckBox,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../untills/context/AuthContext";
import { createGroups, getListGroups } from "../../../untills/api";
import Checkbox from "expo-checkbox";

const ItemAddGroup = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [pageGroup, setPageGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [idGroups, setIdGroups] = useState();
  const [friendCreateGroup, setFriendCreateGroup] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);

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

  // check box chọn vào người dùng tạo nhóm + thêm số người dc chọn
  const toggleCheckbox = (friendId, newValue) => {
    const updatedFriends = friends.map((friend) =>
      friend.id === friendId ? { ...friend, selected: newValue } : friend
    );
    setFriends(updatedFriends);
    // Update selected items
    const newSelectedItems = updatedFriends
      .filter((friend) => friend.selected)
      .map((friend) => friend.id);
    setSelectedItems(newSelectedItems);
    // Update selected count
    setSelectedCount(newSelectedItems.length);
  };

  const handleAddGroup = () => {
    if (selectedItems.length < 2) {
      alert("Tạo nhóm cần chọn ít nhất 2 người bạn.");
      return;
    }

    // if (!groupName.trim()) {
    //   alert("Vui lòng nhập tên nhóm.");
    //   return;
    // }

    // Chuẩn bị dữ liệu cho việc tạo nhóm
    const data = {
      // groupName: groupName.trim(),
      participants: selectedItems,
      groups: groups 
    };

    // Gọi hàm createGroups để tạo nhóm
    createGroups(data)
      .then((res) => {
        alert("Tạo nhóm thành công.");
        // setGroupName("");
        console.log(res.data);
        setGroupId(res.data.id);
        setSelectedItems([]); // Xóa danh sách bạn bè được chọn
        // navigation.navigate("Chatpage", { createdGroup: res.data });
        navigation.navigate("Chatpage", { createdGroup: res.data, groups: groups });
      })
      .catch((error) => {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      getListGroups()
        .then((res) => {
          // Chỉ setRooms với các object đã được lọc
          setGroups(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log("Đã rơi zô đây");
        });
    };
    fetchData();
  }, []);

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
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
          />
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
