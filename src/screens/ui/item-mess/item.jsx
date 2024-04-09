import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../../untills/context/AuthContext';
import { deleteRooms, unFriends } from '../../../untills/api'

const Item = ({ link, name, action, time, tt, delele, roomsDelete, onClick }) => {
  const [mouse, setMouse] = useState(false);
  const [btnForm, setBtnForm] = useState(false);
  const { user } = useContext(AuthContext);

  const handleLeave = () => {
    setMouse(false);
    setBtnForm(false);
  };

  const mouseEntry = (mm) => {
    setMouse(mm);
  };

  const handleBtn = () => {
    setBtnForm(true);
  };

  const handleDelete = () => {
    const idP = {
      idRooms: roomsDelete._id,
    };
    const userAction = {
      id: user._id,
    };

    deleteRooms(userAction.id, idP.idRooms)
      .then((res) => {
        if (user.email === roomsDelete.creator.email) {
          const userReciever1 = { id: roomsDelete.recipient._id };
          unFriends(userReciever1.id, user._id)
            .then((resUser) => {
              if (resUser.data.emailUserActions) {
                alert('Hủy kết bạn thành công');
              } else {
                alert('Hủy kết bạn không thành công');
              }
            })
            .catch((error) => {
              alert('Lỗi Server');
            });
        } else {
          const userReciever2 = { id: roomsDelete.creator._id };
          console.log('Rơi xuống trường hợp 2');
          unFriends(userReciever2.id, user._id)
            .then((resUser) => {
              if (resUser.data.emailUserActions) {
                alert('Hủy kết bạn thành công');
              } else {
                alert('Hủy kết bạn không thành công');
              }
            })
            .catch((error) => {
              alert('Lỗi Server');
            });
        }
      })
      .catch((err) => {
        alert('Lỗi hủy phòng');
      });
  };

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: mouse ? 'rgb(227, 222, 222)' : 'white' }]}
      onPress={onClick}
      onPressIn={() => mouseEntry(true)}
      onPressOut={() => handleLeave(false)}
    >
      <View style={styles.itemName}>
        <Image source={{ uri: link }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <View style={styles.name}>
          <Text style={styles.messName}>{name}</Text>
          <Text style={styles.messInfo}>{tt}{action}</Text>
        </View>
      </View>
      <Text>{mouse ? <Text onPress={handleBtn}>...</Text> : time}</Text>
      {btnForm && (
        <View style={{ position: 'absolute', display: 'flex', flexDirection: 'column', right: 0, justifyContent: 'center', zIndex: 50, marginTop: 22 }}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={{ color: '#fff', fontSize: 14 }}>Unfriend</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  itemName: {
    flexDirection: 'row',
  },
  name: {
    marginLeft: 10,
    paddingLeft: 20,
  },
  messName: {
    fontSize: 20,
    paddingBottom: 5,
  },
  messInfo: {
    fontSize: 15,
    color: 'gray',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default Item;
