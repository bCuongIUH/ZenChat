import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Info = () => {
  const nav = useNavigation();

  const user = {
    name: 'Bạch Cường',
    phoneNumber: '0123456789',
    email: 'bachcuong27@gmail.com',
    address: '108 Nguyễn Thượng Hiên',
    imageUrl: 'https://res.cloudinary.com/dhpqoqtgx/image/upload/v1709272691/ywgngx6l24nrwylcp2ta.jpg',
  };

  const handleGoBack = () => {
    nav.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.info}>{`Phone: ${user.phoneNumber}`}</Text>
      <Text style={styles.info}>{`Email: ${user.email}`}</Text>
      <Text style={styles.info}>{`Địa chỉ: ${user.address}`}</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Info;
