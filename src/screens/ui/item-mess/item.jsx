import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../untills/context/AuthContext'
import { deleteRooms, unFriends, acceptFriends, undoFriends } from '../../untills/api'
import { SocketContext } from '../../untills/context/SocketContext';

const Item = ({ link, name, action, time, tt, delele, roomsDelete, onClick, idd }) => {
    const [undo, setUndo] = useState('Undo');
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    useEffect(() => {
        // Cập nhật trạng thái nút action (Undo, Accept, Unfriend)
        const updateButtonState = () => {
            if (user.sendFriend.some(item => item._id === idd)) {
                setUndo('Undo');
            } else if (user.waitAccept.some(item => item._id === idd)) {
                setUndo('Accept');
            } else {
                setUndo('Unfriend');
            }
        };

        // Lắng nghe sự kiện cập nhật gửi lời mời kết bạn
        const updateSentFriendListener = (data) => {
            if (data.reload) {
                setUndo('Undo');
            } else {
                setUndo('Accept');
            }
        };

        // Lắng nghe sự kiện cập nhật hủy kết bạn
        const updateUnfriendListener = (roomsU) => {
            if (roomsU) {
                setUndo('Unfriend');
            }
        };

        // Lắng nghe sự kiện từ server
        socket.on('connected', () => console.log('Connected'));
        socket.on(`sendfriends${user.email}`, updateSentFriendListener);
        socket.on(`updateSendedFriend${roomsDelete._id}${user.email}`, updateUnfriendListener);

        // Clean up: ngừng lắng nghe khi component unmount
        return () => {
            socket.off('connected');
            socket.off(`sendfriends${user.email}`, updateSentFriendListener);
            socket.off(`updateSendedFriend${roomsDelete._id}${user.email}`, updateUnfriendListener);
        };
    }, []);

    // Hàm xử lý hành động Unfriend
    const handleUnfriend = () => {
        const idP = {
            idRooms: roomsDelete._id,
        };
        const userAction = {
            id: user._id,
        };

        deleteRooms(userAction.id, idP.idRooms)
            .then((res) => {
                let userRecieverId;
                if (user.email === roomsDelete.creator.email) {
                    userRecieverId = roomsDelete.recipient._id;
                } else {
                    userRecieverId = roomsDelete.creator._id;
                }

                unFriends(userRecieverId, idP)
                    .then((resUser) => {
                        if (resUser.data.emailUserActions) {
                            alert('Hủy kết bạn thành công');
                        } else {
                            alert('Hủy kết bạn không thành công');
                        }
                    })
                    .catch((error) => {
                        alert('Lỗi Server');
                    });
            })
            .catch((err) => {
                alert('Lỗi hủy phòng');
            });
    };

    return (
        <TouchableOpacity style={{ position: 'relative' }} onPress={onClick}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: link }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Text>
                    <Text>{tt}{action}</Text>
                </View>
            </View>
            <Text>{time}</Text>
            {undo === 'Unfriend' && (
                <TouchableOpacity onPress={handleUnfriend} style={{ backgroundColor: 'red', borderRadius: 5, padding: 8, marginTop: 5 }}>
                    <Text style={{ color: 'white' }}>Unfriend</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default Item;
