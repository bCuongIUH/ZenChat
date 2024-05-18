import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome, AntDesign, EvilIcons } from "@expo/vector-icons";
import { AuthContext } from "../../untills/context/AuthContext";

const Time = () => {
  const nav = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const { user } = useContext(AuthContext);
  const fullName = user.fullName;

  const handleSearchIconPress = () => {
    setSearchText("");
    setIsSearching(!isSearching);
  };

  const handleAddFriendPress = () => {
    setActionModalVisible(true);
  };

  const handleCreateChatPress = () => {
    setActionModalVisible(false);
    nav.navigate("ItemAddFriend");
  };

  const handleModalClose = () => {
    setActionModalVisible(false);
  };

  const savePostToAPI = async (post) => {
    try {
      const response = await fetch('https://65d5a412f6967ba8e3bc15a2.mockapi.io/Zen-Chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error('Failed to save post');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (postText.trim() !== "") {
      const newPost = {
        id: posts.length + 1,
        text: postText,
        likes: 0,
        comments: [],
        author: user.fullName,
      };

      try {
        const savedPost = await savePostToAPI(newPost);
        setPosts((prevPosts) => [...prevPosts, savedPost]);
        setPostText("");
      } catch (error) {
        console.error('Error saving post:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://65d5a412f6967ba8e3bc15a2.mockapi.io/Zen-Chat/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://65d5a412f6967ba8e3bc15a2.mockapi.io/Zen-Chat');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.textInfo}>{item.author}</Text>
      <Text>{item.text}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="hearto" size={24} color="black" />
          <Text style={styles.actionText}>Like: {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <EvilIcons name="comment" size={24} color="black" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.actionButton}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={item.comments}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          {isSearching ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập từ khóa tìm kiếm"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={setSearchText}
            />
          ) : null}
          <TouchableOpacity onPress={handleSearchIconPress}>
            {isSearching ? (
              <AntDesign name="closecircleo" size={24} color="black" />
            ) : (
              <Ionicons
                style={styles.searchIcon}
                name="search"
                size={24}
                color="black"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddFriendPress}
            style={styles.addFriendButton}
          >
            <Ionicons name="person-add-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <TextInput
            placeholder="Hôm nay bạn thấy thế nào?"
            placeholderTextColor="#ccc"
            value={postText}
            onChangeText={setPostText}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={handlePost} style={styles.postButton}>
          <Text>Đăng</Text>
        </TouchableOpacity>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <StatusBar backgroundColor="gray" barStyle="dark-content" />
      <View style={styles.menuView}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Chatpage")}
        >
          <AntDesign name="message1" size={35} color="#black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Friend")}
        >
          <FontAwesome name="address-book-o" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("Time")}
        >
          <Ionicons name="time-outline" size={35} color="#ff8c00" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => nav.navigate("User")}
        >
          <FontAwesome
            name="user"
            size={35}
            color={
              nav && nav.route && nav.route.name === "User"
                ? "#ff8c00"
                : "black"
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  header: {
    width: width * 1,
    height: 80,
    paddingTop: 20,
    backgroundColor: "#ff8c00",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: width * 1,
    height: height * 1,
  },
  searchBarContainer: {
    position: "absolute",
    height: 50,
    width: width * 1,
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 35,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 10,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  addFriendButton: {
    marginLeft: "auto",
    marginRight: 10,
  },
  content: {
    flex: 1,
    width: width * 1,
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
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
  },
  menuView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#fff",
    borderTopWidth: 0.4,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingLeft: 10,
  },
  textInfo:{
    fontSize :18,
    fontWeight: 'bold',
    fontStyle :'italic'
  }
});

export default Time;
