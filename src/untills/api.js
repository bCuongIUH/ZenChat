import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const config = { withCredentials: true };
const API_URL = "http://localhost:3050/api";

export const postEmail = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/sendMail`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const postRegister = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const postValidRegister = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/statusValid`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const postLogin = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, config);
    return response;
  } catch (error) {
    return error;
  }
};

// export const logoutUser = () =>{
//   return new Promise((reject, resolve) => { 
//       axios.post(`${API_URL}/auth/logout`, {}, config)
//       .then(res => {
//           reject(res);
//       })
//       .catch(err => {
//           resolve(err);
//       })
//   })
   
// };
export const getAuthUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`, config);
    return response;
  } catch (error) {
    return error;
  }
};

//set cookie

export const getCookieExist = () => {

  return axios.get(`${API_URL}/auth/checkCookie`, config)

}


export const removeCookie = () => {
  return new Promise((reject, resolve) => {
      axios.get(`${API_URL}/auth/removeCookie`, config)
          .then(res => {
              reject(res);
          })
          .catch(err => {
              resolve(err)
          })
  })

}
export const getListRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const getRoomsMessages = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/messages/room`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};

export const createMessage = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, data, config);
    return response;
  } catch (error) {
    return error;
  }
};
