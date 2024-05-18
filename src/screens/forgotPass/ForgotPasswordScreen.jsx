
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { forgotAccount } from '../../untills/api'; // Import API function

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrModal, setShowErrModal] = useState(false); // State để hiển thị modal lỗi
  const [emailError, setEmailError] = useState(''); // State để hiển thị lỗi email

  // Hàm gửi mã xác nhận
  const handleSendVerificationCode = () => {
    // Kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError('Vui lòng nhập đúng địa chỉ email!!!');
      return;
    }

    // Gửi yêu cầu lấy mã xác nhận đến email
    setIsLoading(true); // Hiển thị loading
    forgotAccount({ email })
      .then((response) => {
        setIsLoading(false); 
        setShowSuccessModal(true); // Hiển thị modal thành công
        // Đặt timeout để đóng modal sau 5 giây và quay lại màn hình trước
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack(); // Quay lại màn hình trước đó
        }, 5000);
      })
      .catch((error) => {
        setIsLoading(false); // Ẩn loading nếu có lỗi xảy ra
        setShowErrModal(true); // Hiển thị modal lỗi
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {emailError !== '' && <Text style={styles.errorMessage}>{emailError}</Text>}
      <Button color={'#ff8c00'} title="Gửi mã xác nhận" onPress={handleSendVerificationCode} />

      {isLoading && <ActivityIndicator size="large" color="#ff8c00" />} {/* Hiển thị loading khi đang tải */}

      {/* Modal hiển thị khi gửi thành công */}
      {showSuccessModal && (
        <View style={styles.modal}>
          <Text>Mật khẩu mới đã được gửi về email của bạn</Text>
          <Image source={require('../forgotPass/Success Micro-interaction.gif')} style={styles.image} />
        </View>
      )}

      {/* Modal hiển thị khi gửi thất bại */}
      {showErrModal && (
        <View style={styles.modal}>
          <Text style={{ margin: 0, lineHeight: 1.5 }}>Vui lòng nhập chính xác email đăng ký tài khoản của bạn</Text>
          <Image source={require('../forgotPass/giphy.gif')} style={styles.image} />
        </View>
      )}
    </View>
  );
};

// CSS styles
// CSS styles
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
    width: '80%',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 190,
    height: 120,
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
