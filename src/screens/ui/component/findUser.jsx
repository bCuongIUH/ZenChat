import React, { createContext, useContext, useState } from 'react';
import { findAuth } from '../../../untills/api';
// Creating a context
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userFound, setUserFound] = useState([]);

  const handleFindUser = async (phoneNumber) => {
    const data = { phoneNumber };
    try {
      const res = await findAuth(data);
      if (!res.data) {
        alert("Không tìm thấy người dùng");
      } else {
        return res.data;
      }
    } catch (err) {
      alert("Lỗi Server");
    }
  };

  return (
    <UserContext.Provider value={{ userFound, handleFindUser }}>
      {children}
    </UserContext.Provider>
  );
};