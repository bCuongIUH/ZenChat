// import React, { useContext, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   Dimensions,
//   Alert,
// } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../../../untills/context/AuthContext";
// import {
//   logoutUser,
//   removeCookie,
//   findAuth,
//   createRooms,
// } from "../../../untills/api";

// const ItemAddFriend = () => {
//   const navigation = useNavigation();
//   const { user } = useContext(AuthContext);

//   const [authFound, setAuthFound] = useState([]);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [errForm, setErrForm] = useState("");
//   const errFormRef = useRef(null);
//   const regexPatterns = {
//     phoneNumber:  /^\(\+84\)\d{9}$/, // Sửa biểu thức chính quy
//   };

//   const handleFoundUser = async () => {
//     const result = await findAuth(phoneNumber);
//     if (result !== undefined) {
//       setAuthFound([result]);
//     } else {
//       setAuthFound([]);
//     }
//   };

//   const handleAddFriend = async (auth) => {
//     let processedPhoneNumber = phoneNumber.trim();
//     if (phoneNumber.startsWith("0")) {
//       processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
//     } else if (!phoneNumber.startsWith("+84")) {
//       processedPhoneNumber = `(+84)${phoneNumber}`;
//     }

//     if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {
//       setErrForm("Số điện thoại không đúng.");
//       if (errFormRef.current) {
//         errFormRef.current.style.top = "0";
//         setTimeout(() => {
//           errFormRef.current.style.top = "-100px";
//         }, 3000);
//       }
//     } else {
//       const message = "hello"; //tao biến cứng
//       const authen = [auth.email];
//       const email = authen[0]; // lấy thằng đầu tiên
//       const data1 = { email, message };

//       createRooms(data1)
//         .then((res) => {
//           if (res.data.message === "Đã tạo phòng với User này ròi") {
//             alert("Đã tạo phòng với User này ròi !!!");
//             return;
//           }
//           if (res.data.status === 400) {
//             alert("Không thể nhắn tin với chính bản thân mình !!!");
//             return;
//           } else {
//             navigation.goBack();
//           }
//         })
//         .catch((err) => {
//           alert("Lỗi hệ thống");
//         });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign name="arrowleft" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Thêm bạn</Text>
//       </View>

//       <View style={styles.infoContainer}>
//         <TextInput
//           style={styles.input}
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           placeholder="Nhập số điện thoại"
//         />
//       </View>

//       <TouchableOpacity style={styles.saveButton} onPress={handleFoundUser}>
//         <Text style={styles.saveButtonText}>Tìm kiếm</Text>
//       </TouchableOpacity>

//       {authFound.map((auth, index) => (
//         <View key={index} style={styles.userInfoContainer}>
//           <Image source={{ uri: auth.avatar }} style={styles.avatar} />
//           <Text style={styles.fullName}>{auth.fullName}</Text>
//           <Text style={styles.phoneNumber}>
//             Số điện thoại: {auth.phoneNumber}
//           </Text>

//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => handleAddFriend(auth)}
//           >
//             <Text style={styles.addButtonText}>Thêm bạn</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       <View ref={errFormRef} style={styles.errorContainer}>
//         <Text style={styles.errorText}>{errForm}</Text>
//       </View>
//     </View>
//   );
// };

// const { width, height } = Dimensions.get("window");
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ff8c00",
//     paddingVertical: 20,
//   },
//   infoContainer: {
//     marginBottom: 10,
//     marginLeft: 10,
//     marginTop: 20,
//     marginRight: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//   },
//   saveButton: {
//     backgroundColor: "silver",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   saveButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   headerText: {
//     fontSize: 20,
//     color: "white",
//     marginLeft: 5,
//   },
//   errorContainer: {
//     position: "absolute",
//     top: -100,
//     left: 0,
//     right: 0,
//     backgroundColor: "red",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     color: "white",
//   },
//   userInfoContainer: {
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 8,
//     margin: 10,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   fullName: {
//     fontWeight: "bold",
//     fontSize: 18,
//     flex: 1,
//   },
//   phoneNumber: {
//     fontSize: 15,
//   },
//   addButton: {
//     backgroundColor: "#ff8c00",
//     padding: 10,
//     borderRadius: 5,
//   },
//   addButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default ItemAddFriend;

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { findAuth, createRooms } from "../../../untills/api";
import { useUser } from "../../ui/component/findUser";

const ItemAddFriend = () => {
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authFound, setAuthFound] = useState(null);
  const [isAddClicked, setIsAddClicked] = useState(false);

  const handleSearchChange = (text) => {
    setPhoneNumber(text);
  };

  const handleFoundUser = async () => {
    try {
      const data = { phoneNumber };
      const result = await findAuth(data);
      setAuthFound(result);
      console.log(authFound);
    } catch (error) {
      console.error("Error finding user:", error);
    }
  };
  // //   const handleFoundUser = async (e) => {

  // //     const data = phoneNumber;

  // //     const result = await handleFindUser(data); // thay findAuth thành handleFindUser thì load nhanh hơn k cần bọc thẻ UserProvider

  // //     if (result !== undefined) {
  // //         const obj = [];
  // //         obj.push(result)
  // //        setAuthFound(obj);
  // //        return;
  // //     }

  // // }
  useEffect(() => {
    console.log(authFound);
   
  }); 

  const handleAddClick = () => {
    const message = "hello";
    const authen = [authFound[0].email];
    const email = authen[0];
    const data1 = { email, message };

    createRooms(data1)
      .then((res) => {
        if (res.data.message === "Đã tạo phòng với User này ròi") {
          alert("Đã tạo phòng với User này ròi !!!");
          return;
        }
        if (res.data.status === 400) {
          alert("Không thể nhắn tin với chính bản thân mình !!!");
          return;
        } else {
          // window.location.reload();
          formRef.current.style.display = "none";
        }
      })
      .catch((err) => {
        alert("Lỗi hệ thống");
      });
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleSearchChange}
        placeholder="Nhập số điện thoại"
        value={phoneNumber}
      />
      <Button title="Tìm kiếm" onPress={handleFoundUser} />

      {/* {authFound && */}
      
{/* 
          <View key={auth._id} style={styles.showAdd}>
            <View style={styles.userInfo}> */}
              {/* <Image source={{ uri: authFound.avatar }} style={styles.avatar} /> */}
              {/* <Text style={styles.fullName}>{authFound.fullName}</Text> */}
              {/* <Text style={styles.phoneNumber}>
                PhoneNumber: {authFound.data.phoneNumber}
              </Text>
            </View>
            <TouchableOpacity onPress={handleAddClick}>
              <Text
                style={[
                  styles.addButton,
                  {
                    backgroundColor: isAddClicked
                      ? "rgb(204, 82, 30)"
                      : "rgb(204, 82, 30)",
                  },
                ]}
              >
                {isAddClicked ? "Undo" : "Add"}
              </Text>
            </TouchableOpacity>
          </View> */}
      

      {/* Nút Add */}
      {authFound && !isAddClicked && (
        <TouchableOpacity onPress={handleAddClick}>
          <Text style={styles.addButton}>Thêm bạn</Text>
        </TouchableOpacity>
      )}

      {/* Nút Cancel */}
      {authFound && isAddClicked && (
        <TouchableOpacity onPress={() => setIsAddClicked(false)}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: "white",
  },
  userInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#ff8c00",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
    marginBottom: 10,
  },
});

export default ItemAddFriend;
