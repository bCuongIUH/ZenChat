import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ItemGroup = ({ link, nameGroup, action, time, tt, onClick }) => {
  const [mouse, setMouse] = useState(false);
  const [btnForm, setBtnForm] = useState(false);

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

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: mouse ? '#e3dede' : 'white' }]}
      onPress={onClick}
      onMouseEnter={() => mouseEntry(true)}
      onMouseLeave={() => handleLeave()}
    >
      <View style={styles.itemName}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' }} style={styles.avatar} />
          <Image source={{ uri: 'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' }} style={styles.avatar} />
          <Image source={{ uri: 'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' }} style={styles.avatar} />
        </View>
        <View style={styles.name}>
          <Text style={styles.messName}>{nameGroup}</Text>
          <Text style={styles.messInfo}>{tt}{action}</Text>
        </View>
      </View>
      <Text>{mouse ? <TouchableOpacity onPress={handleBtn}><Text>...</Text></TouchableOpacity> : time}</Text>
      {btnForm && (
        <View style={styles.btnForm}>
          {/* Your form components */}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-between',
  },
  itemName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 50,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
  },
  name: {
    paddingLeft: 20,
  },
  messName: {
    fontSize: 20,
    paddingBottom: 5,
  },
  messInfo: {
    fontSize: 15,
  },
  btnForm: {
    position: 'absolute',
    flexDirection: 'column',
    right: 0,
    justifyContent: 'center',
    zIndex: 50,
    marginTop: 22,
  },
});

export default ItemGroup;
