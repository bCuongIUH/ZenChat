import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { createMessagesGroup, kickGroups } from '../../../untills/api';
import { SocketContext } from '../../../untills/context/SocketContext';

const ItemMemberGroup = ({route}) => {
  const nav = useNavigation();
  const [searchText, setSearchText] = useState('');
  const { group } = route.params;
  const members = group.participants || [];
  const socket = useContext(SocketContext);
  const [messagesGroups, setMessagesGroups] = useState([]);
  const [participants, setParticipants] = useState(members); // Ban đầu gán là danh sách thành viên

  // Kích thành viên khỏi nhóm
  const onClickKick = (id) => {
    const data = {
      idGroups: group._id,
      idUserKick: id,
    };
    kickGroups(data)
      .then((res) => {
        if (res.data.groupsUpdate) {
          // Loại bỏ thành viên khỏi danh sách
          setParticipants(prevMembers => prevMembers.filter(member => member._id !== id));
        } else {
          alert('Kick thành viên không thành công') 
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Lỗi hệ thống");
      });
  };

  // Socket
  useEffect(() => {
    if (group === undefined) {
      return;
    }
    // Lắng nghe sự kiện từ socket
    socket.on('connected', () => console.log('Connected'));
    socket.on(`leaveGroupsId${group._id}`, (data) => {
      if (data.userLeave !== user.email) {
        setParticipants(data.groupsUpdate.participants);
      }
    });
    socket.on(`attendGroup${group._id}`, (data) => {
      if (data) {
        setParticipants(data.groupsUpdate.participants);
      }
    });
    socket.on(`kickOutGroup${group._id}`, (data) => {
      setParticipants(data.groupsUpdate.participants);
    });
    socket.on(`updateGroup${group._id}`, data => {
      // Xử lý cập nhật thông tin nhóm
    });

    // Return cleanup function
    return () => {
      socket.off(`leaveGroupsId${group._id}`);
      socket.off(`attendGroup${group._id}`);
      socket.off(`kickOutGroup${group._id}`);
      socket.off(`updateGroup${group._id}`);
    };
  }, [socket, group]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Go back button */}
        <TouchableOpacity style={styles.goBackButton} onPress={nav.goBack} >
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thành viên nhóm</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thành viên"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        {/* Add search icon here if needed */}
      </View>

      {/* Member list */}
      <View style={styles.memberListContainer}>
        {/* Member count */}
        <Text style={styles.memberCount}>Thành viên {participants.length}</Text>
        
        {/* List of members */}
        <FlatList
          data={participants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Image
                source={{ uri: item.avatar }} 
                style={styles.avatar}
              />
              <Text style={styles.memberName}>{item.fullName}</Text>
              <TouchableOpacity style={styles.kickButton} onPress={() => onClickKick(item._id)}>
                <FontAwesome name="user-times" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  searchBar: {
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  memberListContainer: {
    flex: 1,
  },
  memberCount: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  kickButton: {
    padding: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberName: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
});

export default ItemMemberGroup;
