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

const ItemAddGroup = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [group, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(null);

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
    if (selectedPhoneNumbers.length < 2) {
      alert("Tạo nhóm cần chọn ít nhất 2 người bạn.");
      return;
    }

    const data = {
      participants: selectedPhoneNumbers,
      group: group,
    };

    createGroups(data)
      .then((res) => {
        alert("Tạo nhóm thành công.");
        setGroupId(res.data.id);
        setSelectedPhoneNumbers([]);
        navigation.navigate("Chatpage", { createdGroup: res.data, group: group });
      })
      .catch((error) => {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại sau.");
      });
  };

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
