import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../untills/context/AuthContext';
import { updateAccount, updateImageBg, updateImageAVT } from '../../../untills/api';
import * as ImagePicker from 'expo-image-picker';

const ItemUpdateUser = () => {
    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay
    const [showSuccessModal, setShowSuccessModal] = useState(false); // modal success tick xanh uy tín
    const [showErrorModal, setShowErrorModal] = useState(false); // Modal errr
    const [errorMessage, setErrorMessage] = useState(''); // Định nghĩa errorMessage và setErrorMessage
    const { user } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(user.avatar);
    const [background, setBackground] = useState(user.background);
    const [name, setName] = useState(user.fullName);
    const [gender, setGender] = useState(user.gender);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const navigation = useNavigation();
    const [filePathAvatar, setFilePathAvatar] = useState([]);
    const [filePathBackground, setFilePathBackground] = useState([]);
    const [isDataChanged, setIsDataChanged] = useState(false); // Trạng thái xác định liệu dữ liệu đã được thay đổi hay không

    // Hàm xác định xem dữ liệu đã được thay đổi hay không
    const checkDataChanged = () => {
        if (
            name !== user.fullName ||
            gender !== user.gender ||
            dateOfBirth !== user.dateOfBirth ||
            avatar !== user.avatar ||
            background !== user.background
        ) {
            setIsDataChanged(true); // Nếu có bất kỳ sự thay đổi nào, đặt isDataChanged thành true
        } else {
            setIsDataChanged(false); // Ngược lại, đặt isDataChanged thành false
        }
    };

    useEffect(() => {
        checkDataChanged();
    }, [name, gender, dateOfBirth, avatar, background]);

    const regexPatterns = {
        fullName: /^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*\s?)+$/,
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        setIsActive(false);
    };

    const handleBackHome = () => {
        navigation.navigate('ItemSecurity');
    };

    const handleEditAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.uri);
            setFilePathAvatar(result.assets);
            checkDataChanged();
        }
    };

    const handleEditBackground = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setBackground(result.uri);
            setFilePathBackground(result.assets);
            checkDataChanged();
        }
    };

    const handleNameChange = (e) => {
        setName(e.nativeEvent.text);
    };

    const handleGenderChange = (e) => {
        setGender(e.nativeEvent.text);
    };

    const handleDateOfBirthChange = (e) => {
        setDateOfBirth(e.nativeEvent.text);
    };

    const handleUpdate = () => {
        setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
        setIsLoading(true); // Hiển thị modal loading

        const data = {
            fullName: name,
            dateOfBirth,
            avatar: user.avatar,
            gender,
            background: user.background,
        };

        if (!regexPatterns.fullName.test(name)) {
            setErrorMessage('Please enter the name in the correct format.');
            setShowErrorModal(true); // Hiển thị modal error
            setIsLoading(false); // Ẩn modal loading
            return;
        }

        const dobDate = new Date(dateOfBirth);
        const currentDate = new Date();
        if (dobDate >= currentDate) {
            setErrorMessage('Date of birth must be before today.');
            setShowErrorModal(true); // Hiển thị modal error
            setIsLoading(false); // Ẩn modal loading
            return;
        }

        const handleUpdateAccount = (avtUrl, bgUrl) => {
            data.avtUrl = avtUrl || user.avatar;
            data.bgUrl = bgUrl || user.background;
            updateAccount(user._id, data)
                .then(resUpdate => {
                    if (resUpdate.status === 200) {
                        setTimeout(() => {
                            setIsLoading(false); // Ẩn modal loading
                            setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                            setTimeout(() => {
                                setShowSuccessModal(false);
                                handleBackHome();
                            }, 2000);
                        }, 5000);
                    } else {

                        setIsLoading(false); // Ẩn modal loading
                        setErrorMessage('You are not the owner of this account');
                        setShowErrorModal(true);
                    }
                })
                .catch((err) => {
                    setIsLoading(false); // Ẩn modal loading
                    setErrorMessage('Fail to upload User');
                    setShowErrorModal(true);
                });
        };

        const handleUpdateImages = async () => {
            try {
                let avtUrl = null;
                let bgUrl = null;

                if (filePathAvatar.length > 0) {
                    const formData = new FormData();
                    formData.append('fileAvatar', {
                        uri: filePathAvatar[0].uri,
                        type: 'image/jpeg',
                        name: 'avatar.jpg',
                    });
                    const resAvt = await updateImageAVT(formData);
                    avtUrl = resAvt.data;
                }

                if (filePathBackground.length > 0) {
                    const formData = new FormData();
                    formData.append('fileBackground', {
                        uri: filePathBackground[0].uri,
                        type: 'image/jpeg',
                        name: 'background.jpg',
                    });
                    const resBg = await updateImageBg(formData);
                    bgUrl = resBg.data;
                }

                handleUpdateAccount(avtUrl, bgUrl);
            } catch (err) {
                setIsLoading(false); // Ẩn modal loading
                setErrorMessage('Fail to upload images');
                setShowErrorModal(true);
            }
        };

        handleUpdateImages();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.sectionOne}>
                <View style={styles.titleSectionOne}>
                    <TouchableOpacity onPress={handleBackHome} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Quay lại</Text>
                </View>
            </View>

            <View style={styles.sectionTwo}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: background }} style={styles.backgroundImage} />
                    <TouchableOpacity onPress={handleEditAvatar} style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.header}>Thông tin cá nhân</Text>
                    <Text style={styles.label}>Tên</Text>
                    <TextInput
                        value={name}
                        onChange={handleNameChange}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Giới tính</Text>
                    <TextInput
                        value={gender}
                        onChange={handleGenderChange}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Ngày Sinh</Text>
                    <TextInput
                        value={dateOfBirth}
                        onChange={handleDateOfBirthChange}
                        placeholder="YYYY-MM-DD"
                        style={styles.input}
                    />
                    <Button
                        title="Update"
                        onPress={handleUpdate}
                        color={isDataChanged ? 'orange' : 'grey'}
                        disabled={!isDataChanged}
                    />
                </View>
            </View>

            {isLoading && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isLoading}
                    onRequestClose={() => setIsLoading(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text>Loading...</Text>
                        </View>
                    </View>
                </Modal>
            )}

            {showSuccessModal && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showSuccessModal}
                    onRequestClose={() => setShowSuccessModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.successText}>Success!</Text>
                        </View>
                    </View>
                </Modal>
            )}

            {showErrorModal && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showErrorModal}
                    onRequestClose={handleCloseErrorModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                            <Button title="Close" onPress={handleCloseErrorModal} />
                        </View>
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    sectionOne: {
        backgroundColor: "#ff8c00",
        padding: 20,
    },
    titleSectionOne: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontSize: 18,
        color: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    sectionTwo: {
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    backgroundImage: {
        width: '100%',
        height: 200,
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -50,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
    },
    infoContainer: {
        marginTop: 70, // Increased margin to accommodate the avatar overlap
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        fontSize: 18,
        color: 'green',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10,
    },
});

export default ItemUpdateUser;
