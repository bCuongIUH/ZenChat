import React, { useState } from "react";
import { AuthContext } from "../ZenChat/src/untills/context/AuthContext";
import SignupContext from "../ZenChat/src/untills/context/SignupContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../ZenChat/src/screens/home/home";
import Login from "./src/screens/login/login";
import { SignUp } from "../ZenChat/src/screens/signUp/SignUp";
import { Chatpage } from "./src/screens/ui/Chatpage";
import ForgotPasswordScreen from "./src/screens/forgotPass/ForgotPasswordScreen";
import {OTPConfirmationForm}  from "./src/screens/vertify/OTPConfirmationForm";
import { RequireAuth } from "../ZenChat/src/component/AuthenticatedRouter";
import Time from "./src/screens/ui/time";
import Friend from "./src/screens/ui/friend";
import User from "./src/screens/ui/user";
import Info from "./src/screens/ui/inf";
import {SocketContext, socket } from "./src/untills/context/SocketContext";

const Stack = createNativeStackNavigator();
function App() {
  const [user, setUser] = useState();

  return (
    <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
      <SignupContext>
      <SocketContext.Provider value={socket}>
        <NavigationContainer>
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
            <Stack.Screen name="Friend" component={Friend} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="Info" component={Info} />
          </Stack.Navigator>
          
          {/* <Stack.Navigator>
          <Stack.Screen
              name="OTPConfirmationForm"
              component={OTPConfirmationForm}
            />
          </Stack.Navigator> */}

        </NavigationContainer>
        </SocketContext.Provider>  
      </SignupContext>
    </AuthContext.Provider>
  );
}

export default App;
