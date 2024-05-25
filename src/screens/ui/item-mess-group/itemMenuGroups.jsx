import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { deleteGroup, leaveGroup } from '../../../untills/api';
import { SocketContext } from '../../../untills/context/SocketContext';

const ItemMenuGroups = ({route}) => {
  const { group } = route.params;
  const nav = useNavigation();
  const { user } = useContext(AuthContext);
  const [numberOfMembers, setNumberOfMembers] = useState(0);
  const [participants, setParticipants] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (group && group.participants) {
      setNumberOfMembers(group.participants.length);
    } else {
      setNumberOfMembers(0);
    }
  }, [group]);

  const handleModalADD = () => {
    nav.navigate('ItemAddMemberGroups', { group });
  };

  const handleDissolution = () => {
    const data = {
      groupId: group._id
    };
    deleteGroup(data.groupId)
      .then((res) => {
        if (res.data.creator.email) {
          alert("Giải tán nhóm thành công");
          nav.navigate('Chatpage');
        } else {
          alert("Giải tán phòng không thành công");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Lỗi hệ thống");
      });
  };

  const handleLeaveGroup = () => {
    const data = {
      groupId: group._id
    };
    leaveGroup(data)
      .then((res) => {
        if (res.data.message === "Bạn là chủ phòng bạn không thể rời đi") {
          alert(res.data.message);
        } else if(res.data.status === 400) {
          alert("Rời phòng không thành công");
          nav.navigate('Chatpage');
        } else {
          setParticipants(res.data.groupsUpdate.participants);
          alert("Rời phòng thành công");
          nav.navigate('Chatpage');
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Lỗi Server");
      });
  };

  useEffect(() => {
    if (group === undefined) {
      return;
    }
    socket.on('connected', () => console.log('Connected'));
    socket.on(`leaveGroupsId${group._id}`, (data) => {
      if (data.userLeave !== user.email) {
        setParticipants(data.groupsUpdate.participants);
        setNumberOfMembers(data.groupsUpdate.participants.length);
      }
    });
    socket.on(`attendGroup${group._id}`, (data) => {
      if (data) {
        setParticipants(data.groupsUpdate.participants);
        setNumberOfMembers(data.groupsUpdate.participants.length);
      }
    });
    socket.on(`kickOutGroup${group._id}`, (data) => {
      setParticipants(data.groupsUpdate.participants);
      setNumberOfMembers(data.groupsUpdate.participants.length);
    });
    socket.on(`updateGroup${group._id}`, data => {
      // Xử lý cập nhật thông tin nhóm
    });

    return () => {
      socket.off(`leaveGroupsId${group._id}`);
      socket.off(`attendGroup${group._id}`);
      socket.off(`kickOutGroup${group._id}`);
      socket.off(`updateGroup${group._id}`);
    };
  }, [socket, group]);

  const [updateImageGroup, setUpdateImageGroup] = useState();
  const setTingNameGroups = (group) => {
    if (group.nameGroups === '') {
      return `Groups của ${group.creator.fullName}`;
    } else {
      return group.nameGroups;
    }
  };

  const navigateToMembersScreen = () => {
    nav.navigate('ItemMemberGroup', {
      group
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.goBack} >
        <FontAwesome name="angle-left" size={24} color="black" />
        <Text style={styles.goBackText}>Tùy chọn</Text>
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Image source={ group.avtGroups} style={styles.itemImage} />
        <Text style={styles.itemName}>{setTingNameGroups(group)}</Text>
        <TouchableOpacity>
          
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="search" size={20} color="black" />
          <Text style={styles.optionText}>Tìm kiếm tin nhắn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleModalADD}>
          <FontAwesome name="user-plus" size={20} color="black" />
          <Text style={styles.optionText}>Thêm thành viên</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="image" size={20} color="black" />
          <Text style={styles.optionText}>Đổi hình nền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="bell" size={20} color="black" />
          <Text style={styles.optionText}>Bật thông báo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Text style={{margin: 10, fontSize: 16}}>File và ảnh</Text>
          <ScrollView horizontal>
            {[1, 2, 3, 4].map((image, index) => (
              <Image key={index} source={{ uri: `https://picsum.photos/200/300?random=${index}` }} style={styles.image} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreButtonText}>Xem thêm</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.viewMembersButton} onPress={() => numberOfMembers > 0 ? navigateToMembersScreen() : null}>
          <FontAwesome name="users" size={20} color="black" />
          <Text style={styles.viewMembersButtonText}> Xem thành viên nhóm ({numberOfMembers})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.giaiTanGroupButton} onPress={handleDissolution}>
          <Text style={styles.leaveGroupButtonText}>Giải tán</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.leaveGroupButton} onPress={handleLeaveGroup}>
          <Text style={styles.leaveGroupButtonText}>Rời nhóm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  goBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goBackText: {
    marginLeft: 5,
    fontSize: 18,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  groupName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  viewMoreButton: {
    marginTop: 5,
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 10,
  },
  viewMoreButtonText: {
    textAlign: 'center',
  },
  viewMembersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  viewMembersButtonText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  leaveGroupButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  giaiTanGroupButton: {
    backgroundColor: 'silver',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  leaveGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 45  ,
    marginRight: 15,
  },
});

export default ItemMenuGroups;
