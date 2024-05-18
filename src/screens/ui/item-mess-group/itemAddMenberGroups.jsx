// Import useState
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../untills/context/AuthContext';
import { attendGroup } from '../../../untills/api';
import Checkbox from 'expo-checkbox';
import { SocketContext } from '../../../untills/context/SocketContext';
import { FontAwesome } from '@expo/vector-icons'; 

const ItemAddMemberGroups = ({ route }) => {
  const { group } = route.params;
  const nav = useNavigation();
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const socket = useContext(SocketContext);
  const [friendInGroup, setFriendInGroup] = useState({});

  useEffect(() => {
    if (group === undefined) {
      return;
    }
    // Lưu trữ danh sách các số điện thoại của các thành viên trong nhóm vào một mảng
    const participantPhoneNumbers = group.participants.map(participant => participant.phoneNumber);
    setParticipants(participantPhoneNumbers);
  }, [group]);

  const handleCheckboxChange = (phoneNumber) => {
    // Kiểm tra xem số điện thoại của thành viên có trong danh sách thành viên của nhóm không
    if (!participants.includes(phoneNumber)) {
      if (selectedItems.includes(phoneNumber)) {
        setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== phoneNumber));
      } else {
        setSelectedItems(prevSelectedItems => [...prevSelectedItems, phoneNumber]);
      }
    }
  };

  const addMembersToGroup = () => {
    const data = {
      participants: selectedItems,
      groupId: group._id 
    };

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
      <View style={styles.header}>
        {/* Go back button */}
        <TouchableOpacity style={styles.goBackButton} onPress={nav.goBack}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quay lại</Text>
      </View>
      <FlatList
        data={user.friends}
        keyExtractor={(item) => item.phoneNumber} 
        renderItem={({ item }) => (
          <View key={item._id} style={styles.checkboxContainer}>
            <Checkbox
              value={selectedItems.includes(item.phoneNumber)}
              onValueChange={() => handleCheckboxChange(item.phoneNumber)}
              disabled={participants.includes(item.phoneNumber)} // Tắt chức năng chọn nếu thành viên đã có trong nhóm
            />
            <Image
              source={item.avatar}
              style={styles.avatar}
            />
            <Text style={styles.friendName}>{item.fullName}</Text>
            {participants.includes(item.phoneNumber) && <Text>Đã trong nhóm</Text>}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goBackButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#FFA500',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  friendName: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default ItemAddMemberGroups;
