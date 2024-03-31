import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const handleSendVerificationCode = () => {
    
   
    setStep(2);
  };

  const handleResetPassword = () => {
    
    
    navigation.navigate('Login'); // Chuyển đến màn hình đăng nhập
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      {step === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Button  color={'#ff8c00'} title="Gửi mã xác nhận" onPress={handleSendVerificationCode} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Mã xác nhận"
            keyboardType="numeric"
            maxLength={6}
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
          />
          <Button color={'#ff8c00'} title="Đặt lại mật khẩu" onPress={handleResetPassword} />
        </>
      )}
    </View>
  );
};
const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: width* 0.8,
  

  },
  btn:{
    color:'#ff8c00',
  },
});

export default ForgotPasswordScreen;
