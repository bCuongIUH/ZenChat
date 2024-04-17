import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../untills/context/AuthContext';
import { attendGroup } from '../../../untills/api';
import Checkbox from 'expo-checkbox';
import { SocketContext } from '../../../untills/context/SocketContext';

const ItemAddMemberGroups = ({ route }) => {
  const { group } = route.params;
  const nav = useNavigation();
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const socket = useContext(SocketContext);
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
  socket.on(`updateGroup${group._id}`, data => {
      setTam(data.avtGroups)
      setUpdateImageGroup(data.avtGroups)
      setNameGroup(data.nameGroups)
      setNameOfGroups(data.nameGroups)
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
      socket.off(`updateGroup${group._id}`)
  }
},[socket, group])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm thành viên</Text>
      <FlatList
          data={user.friends}
          keyExtractor={(item) => item.phoneNumber} 
          renderItem={({ item }) => (
            
            <View key={item._id} style={styles.checkboxContainer}>
              <Checkbox
                value={selectedItems.includes(item.phoneNumber)}
                onValueChange={() => handleCheckboxChange(item.phoneNumber)}
              />
              <Text style={styles.friendName}>{item.fullName}</Text>
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
});

export default ItemAddMemberGroups;
