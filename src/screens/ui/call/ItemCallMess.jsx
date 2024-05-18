import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ItemCallMess = ({ route }) => {
    const navigation = useNavigation()
    const { room} = route.params;
    console.log(room);
  const handleEndCall = () => {
    // Quay lại màn hình trước đó
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Cuộc gọi đến</Text>

      <View style={styles.fullNameContainer}>
        <Text style={styles.textFullName}>{room.fullName}</Text>
      </View>
      {/* Hình ảnh đại diện của người được gọi */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: room.avatar}} style={styles.avatar} />
      </View>

      {/* Các nút điều khiển gọi */}
      <View style={styles.callControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="volume-high-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="mic-off-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <FontAwesome name="phone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="camera-reverse-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="volume-mute-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Thanh trạng thái */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>Đang kết nối...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  fullNameContainer:{
    marginBottom: 20,
  },
  textFullName:{
    fontSize:18,
    fontWeight:'bold'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  callControls: {
    flexDirection: "row",
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: "#ddd",
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 10,
  },
  endCallButton: {
    backgroundColor: "red",
    borderRadius: 50,
    padding: 20,
    marginHorizontal: 10,
  },
  statusBar: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
  },
});

export default ItemCallMess;
