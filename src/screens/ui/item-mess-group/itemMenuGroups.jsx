import React ,{useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { AuthContext } from "../../../untills/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
const ItemMenuGroups = ({route}) => {
    const { groupInfo, participants } = route.params;
    const nav = useNavigation();
    const { user } = useContext(AuthContext);
    const [numberOfMembers, setNumberOfMembers] = useState(0); // đếm thành viên trong nhóm 
console.log('====================================');
console.log(numberOfMembers);
// Trong màn hình hiển thị chi tiết nhóm (ItemMenuGroups)
console.log(groupInfo); // id

console.log('====================================');
useEffect(() => {
    if (groupInfo && groupInfo.members) {
      setNumberOfMembers(groupInfo.members.length);
    } else {
      setNumberOfMembers(0); // Đặt số lượng thành viên là 0 nếu không có dữ liệu hoặc không có thành viên
    }
  }, [groupInfo]);
  
  const handleModalADD = ()=>{
    nav.navigate('ItemAddMemberGroups',{
      groupInfo :groupInfo,
      participants: participants,
    })
  }

  
  return (
    <ScrollView style={styles.container}>
      {/* Go back button */}
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.goBack} >
        <FontAwesome name="angle-left" size={24} color="black" />
        <Text style={styles.goBackText}>Tùy chọn</Text>
      </TouchableOpacity>

      {/* Avatar and group name */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: 'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' }} style={styles.avatar} />
        <Text style={styles.groupName}>Tên nhóm</Text>
      </View>

      {/* Options */}
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

      {/* Content */}
      <View style={styles.content}>
        {/* Kho chứa ảnh */}
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

        {/* Option xem thành viên nhóm */}
     
        <TouchableOpacity style={styles.viewMembersButton} onPress={() => numberOfMembers > 0 ? navigateToMembersScreen() : null}>
        <FontAwesome name="users" size={20} color="black" />
        <Text style={styles.viewMembersButtonText}> Xem thành viên nhóm ({numberOfMembers})</Text>
        </TouchableOpacity>
        {/* Nút rời nhóm */}
        <TouchableOpacity style={styles.leaveGroupButton}>
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
    borderRadius: 30, // Hình tròn
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Chiều rộng 100%
    flexDirection: 'column', // Hiển thị icon và text theo chiều dọc
    marginRight: 10, // Khoảng cách giữa các option
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center', // Canh chỉnh văn bản giữa
    marginTop: 5, // Khoảng cách giữa icon và text
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
  leaveGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemMenuGroups;
