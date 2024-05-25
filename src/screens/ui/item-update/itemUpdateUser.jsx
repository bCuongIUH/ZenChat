import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView ,Picker} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../untills/context/AuthContext';
import { updateAccount, updateImageBg, updateImageAVT } from '../../../untills/api';
import * as ImagePicker from 'expo-image-picker';

const ItemUpdateUser = () => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(user.avatar);
    const [background, setBackground] = useState(user.background);
    const [name, setName] = useState(user.fullName);
    const [gender, setGender] = useState(user.gender);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const navigation = useNavigation();
    const [filePathAvatar, setFilePathAvatar] = useState([]);
    const [filePathBackground, setFilePathBackground] = useState([]);
    const [isDataChanged, setIsDataChanged] = useState(false);

    const checkDataChanged = () => {
        if (
            name !== user.fullName ||
            gender !== user.gender ||
            dateOfBirth !== user.dateOfBirth ||
            avatar !== user.avatar ||
            background !== user.background
        ) {
            setIsDataChanged(true);
        } else {
            setIsDataChanged(false);
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

    const handleGenderChange = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleDateChange = (type, value) => {
        const dateParts = dateOfBirth.split('-');
        if (type === 'year') dateParts[0] = value;
        if (type === 'month') dateParts[1] = value;
        if (type === 'day') dateParts[2] = value;
        setDateOfBirth(dateParts.join('-'));
    };

    const handleUpdate = () => {
        setIsActive(true);
        setIsLoading(true);

        const data = {
            fullName: name,
            dateOfBirth,
            avatar: user.avatar,
            gender,
            background: user.background,
        };

        if (!regexPatterns.fullName.test(name)) {
            setErrorMessage('Please enter the name in the correct format.');
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }

        const dobDate = new Date(dateOfBirth);
        const currentDate = new Date();
        if (dobDate >= currentDate) {
            setErrorMessage('Date of birth must be before today.');
            setShowErrorModal(true);
            setIsLoading(false);
            return;
        }

        const handleUpdateAccount = (avtUrl, bgUrl) => {
            data.avtUrl = avtUrl || user.avatar;
            data.bgUrl = bgUrl || user.background;
            updateAccount(user._id, data)
                .then(resUpdate => {
                    if (resUpdate.status === 200) {
                        setTimeout(() => {
                            setIsLoading(false);
                            setShowSuccessModal(true);

                            setTimeout(() => {
                                setShowSuccessModal(false);
                                handleBackHome();
                            }, 2000);
                        }, 5000);
                    } else {
                        setIsLoading(false);
                        setErrorMessage('You are not the owner of this account');
                        setShowErrorModal(true);
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
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
                setIsLoading(false);
                setErrorMessage('Fail to upload images');
                setShowErrorModal(true);
            }
        };

        handleUpdateImages();
    };

    const renderPickerItems = (start, end) => {
        const items = [];
        for (let i = start; i <= end; i++) {
            items.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />);
        }
        return items;
    };

    const [year, month, day] = dateOfBirth.split('-');

    return (
        <View style={styles.container}>
            <View style={styles.sectionOne}>
                <View style={styles.titleSectionOne}>
                    <TouchableOpacity onPress={handleBackHome} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Quay lại</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleGenderChange('Nam')}
                            >
                                <View style={[styles.checkbox, gender === 'Nam' && styles.checkedCheckbox]} />
                                <Text style={styles.checkboxLabel}>Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleGenderChange('Nữ')}
                            >
                                <View style={[styles.checkbox, gender === 'Nữ' && styles.checkedCheckbox]} />
                                <Text style={styles.checkboxLabel}>Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.label}>Ngày Sinh</Text>
                        <View style={styles.dateContainer}>
                            <Picker
                                selectedValue={year}
                                onValueChange={(value) => handleDateChange('year', value)}
                                style={styles.datePicker}
                            >
                                {renderPickerItems(1900, new Date().getFullYear())}
                            </Picker>
                            <Picker
                                selectedValue={month}
                                onValueChange={(value) => handleDateChange('month', value)}
                                style={styles.datePicker}
                            >
                                {renderPickerItems(1, 12)}
                            </Picker>
                            <Picker
                                selectedValue={day}
                                onValueChange={(value) => handleDateChange('day', value)}
                                style={styles.datePicker}
                            >
                                {renderPickerItems(1, 31)}
                            </Picker>
                        </View>
                        <Button
                            title="Update"
                            onPress={handleUpdate}
                            color={isDataChanged ? 'orange' : 'grey'}
                            disabled={!isDataChanged}
                            style={styles.updateButton}
                        />
                    </View>
                </View>
            </ScrollView>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    sectionOne: {
        backgroundColor: "#ff8c00",
        padding: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
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
        paddingTop: 80, // Added to prevent content being hidden under the fixed header
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
        marginTop: 70,
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
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: "#ff8c00",
        borderRadius: 20,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePicker: {
        width: '30%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    updateButton: {
        marginTop: 10,
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
