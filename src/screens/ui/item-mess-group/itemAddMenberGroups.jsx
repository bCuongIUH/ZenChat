import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../untills/context/AuthContext";
import { attendGroup } from "../../../untills/api";
import Checkbox from "expo-checkbox";

const ItemAddMemberGroups = ({ route }) => {
  const { groupInfo, participants } = route.params;
  const nav = useNavigation();
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (groupInfo && participants && user) {
      const friendsNumbersInGroup = participants.map(participant => participant.phoneNumber);
      const friendsNotInGroup = user.friends.filter(friend => !friendsNumbersInGroup.includes(friend.phoneNumber));
      setSelectedItems(friendsNotInGroup.map(friend => friend.phoneNumber));
    }
  }, [groupInfo, participants, user]);

  const handleCheckboxChange = (phoneNumber) => {
    if (selectedItems.includes(phoneNumber)) {
      setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== phoneNumber));
    } else {
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, phoneNumber]);
    }
  };

  const addMembersToGroup = () => {
    const data = {
      participants: selectedItems,
      groupId: groupInfo._id 
    };
console.log('==================');
console.log(groupInfo);
console.log('====================================');
    attendGroup(data)
      .then((res) => {
        if (res.data.groupsUpdate) {
          nav.goBack();
          alert("Thêm thành viên thành công");
        } else {
          alert("Bạn không còn là thành viên trong nhóm");
          // Xử lý khi không còn là thành viên trong nhóm
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Lỗi hệ thống");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm thành viên</Text>
      <FlatList
        data={user.friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={selectedItems.includes(item.phoneNumber)}
              onValueChange={() => handleCheckboxChange(item.phoneNumber)}
            />
            {/* <Text>{item.fullName}</Text> Thay vì hiển thị tên, bạn cũng có thể hiển thị avatar ở đây */}
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={addMembersToGroup}>
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#FFA500",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ItemAddMemberGroups;
