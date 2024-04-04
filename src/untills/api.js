import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const config = { withCredentials: true };
const API_URL = "http://localhost:3050/api";

// đăng nhập / đăng ký / xác thực người dùng
export const postEmail = async (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/auth/sendMail`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

export const postRegister = async (data) => {
  const res = axios.post(`${API_URL}/auth/register`, data, config);
  return res;
};
export const postValidRegister = async (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/auth/statusValid`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const postLogin = async (data) => {
  return new Promise((rejects, resolve) => {
    axios
      .post(`${API_URL}/auth/login`, data, config)
      .then((res) => {
        rejects(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const logoutUser = () => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/auth/logout`, {}, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

export const getAuthUser = () => {
  return axios.get(`${API_URL}/auth/status`, config);
};

// Forgot Account
export const forgotAccount = (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/users/forgotAccount`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
//delete Account
export const deleteAccount = (id) => {
  return new Promise((reject, resolve) => {
    axios
      .delete(`${API_URL}/users/deleteUser/${id}`, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
// update Account
export const updateAccount = (id, data) => {
  return new Promise((reject, resolve) => {
    axios
      .put(`${API_URL}/auth/updateUser/${id}`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const updatePassword = (id, data) => {
  return new Promise((reject, resolve) => {
    axios
      .patch(`${API_URL}/auth/updatedPassword/${id}`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
// post Image
export const updateImageAVT = (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/auth/updateImageAVT`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
// post Image Background
export const updateImageBg = (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/auth/updateImageBg`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

//set cookie

export const getCookieExist = () => {
  return axios.get(`${API_URL}/auth/checkCookie`, config);
};

// sửa lại ngày 1/4
export const removeCookie = () => {
  return new Promise((reject, resolve) => {
    axios
      .get(`${API_URL}/users/removeCookie`, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

export const getListRooms = () => {
  return new Promise((reject, resolve) => {
    axios
      .get(`${API_URL}/rooms`, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

// export const findAuth = async (data) => {
//   return new Promise((reject, resolve) => {
//     axios
//       .post(`${API_URL}/auth/findAuth`, data, config)
//       .then((res) => {
//         reject(res);
//       })
//       .catch((err) => {
//         resolve(err);
//       });
//   });
// };
export const findAuth = async (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/findAuth`, data, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//
export const createRooms = async (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/rooms`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

export const deleteMessages = async (id, data) => {
  return new Promise((reject, resolve) => {
    axios
      .delete(
        `${API_URL}/messages/${id}/${data.idMessages}/${data.idLastMessageSent}/${data.email}`,
        config
      )
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const updateMessage = async (id, data) => {
  return new Promise((reject, resolve) => {
    axios
      .patch(`${API_URL}/messages/${id}/updateMessage`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const getRoomsMessages = async (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/messages/room`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
export const createMessage = async (data) => {
  return new Promise((reject, resolve) => {
    axios
      .post(`${API_URL}/messages`, data, config)
      .then((res) => {
        reject(res);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
