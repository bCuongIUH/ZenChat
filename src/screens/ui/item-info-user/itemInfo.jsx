import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../untills/context/AuthContext';

const ItemInfo = () => {
  const nav = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Background Container */}
      <View style={styles.backgroundContainer}>
        <Image source={{ uri: user.background }} style={styles.background} />

        {/* Avatar Container */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
      </View>

      <Text style={styles.info}>{`Tên : ${user.fullName}`}</Text>
      <Text style={styles.info}>{`Phone: ${user.phoneNumber}`}</Text>
      <Text style={styles.info}>{`Ngày Sinh: ${user.dateOfBirth}`}</Text>
      <Text style={styles.info}>{`Email: ${user.email}`}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'relative',
    width: width,
    height: width / 2,
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }], // Đưa avatar về giữa
    width: width / 4, // Kích thước avatar
    height: width / 4, // Kích thước avatar
    borderRadius: width / 8, // Làm tròn avatar
    overflow: 'hidden', // Ẩn bớt phần nằm ngoài bán kính của avatar
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ItemInfo;
