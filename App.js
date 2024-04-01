import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  AuthContext,
  AuthProvider,
} from "../ZenChat/src/untills/context/AuthContext";
import SignupContext from "../ZenChat/src/untills/context/SignupContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../ZenChat/src/screens/home/home";
import Login from "./src/screens/login/login";
import { SignUp } from "../ZenChat/src/screens/signUp/SignUp";
import { Chatpage } from "./src/screens/ui/Chatpage";
import ForgotPasswordScreen from "./src/screens/forgotPass/ForgotPasswordScreen";
import OTPConfirmationForm from "./src/screens/vertify/OTPConfirmationForm";
import { RequireAuth } from "../ZenChat/src/component/AuthenticatedRouter";
import Time from "./src/screens/ui/time";
import Friend from "./src/screens/ui/friend";
import User from "./src/screens/ui/user";
import ItemInfo from "./src/screens/ui/item-info-user/itemInfo";
import ItemSetting from "./src/screens/ui/item-setting/itemSetting";
// import { SocketContext, socket } from "./src/untills/context/SocketContext";
import ItemSecurity from "./src/screens/ui/item-setting-security/itemSecurity";
import ItemUpdateUser from "./src/screens/ui/item-update/itemUpdateUser";
import ItemAddFriend from "./src/screens/ui/item-Friend/itemAddFriend";
import { UserProvider } from "./src/component/findUser";
const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
          <SignupContext>
            {/* <SocketContext.Provider value={socket}> */}
            {/* <NavigationContainer> */}
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen
                name="OTPConfirmationForm"
                component={OTPConfirmationForm}
              />

              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Chatpage">
                {() => (
                  <RequireAuth>
                    <Chatpage />
                  </RequireAuth>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="ForgotPasswordScreen"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen name="Time" component={Time} />

              <Stack.Screen name="Friend">
                {() => (
                  <RequireAuth>
                    <UserProvider>
                      <Friend />
                    </UserProvider>
                  </RequireAuth>
                )}
              </Stack.Screen>

              <Stack.Screen name="User" component={User} />
              <Stack.Screen name="ItemInfo" component={ItemInfo} />
              <Stack.Screen name="ItemSetting" component={ItemSetting} />
              <Stack.Screen name="ItemSecurity" component={ItemSecurity} />
              <Stack.Screen name="ItemUpdateUser" component={ItemUpdateUser} />
              <Stack.Screen name="ItemAddFriend" component={ItemAddFriend} />
            </Stack.Navigator>
            {/* </SocketContext.Provider> */}
          </SignupContext>
        </AuthContext.Provider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
