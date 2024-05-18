import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

const ItemContainerTime = ({ postText, setPostText, handlePost, posts }) => {
  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text>{item.text}</Text>
      <TouchableOpacity onPress={() => handleLike(item.id)}>
        <Text>Likes: {item.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleComment(item.id)}>
        <Text>Comment</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Share</Text>
      </TouchableOpacity>
      <FlatList
        data={item.comments}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="What's on your mind?"
        value={postText}
        onChangeText={setPostText}
        style={styles.input}
      />
      <TouchableOpacity onPress={handlePost} style={styles.postButton}>
        <Text>Post</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  postButton: {
    backgroundColor: "#ff8c00",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});

export default ItemContainerTime;
