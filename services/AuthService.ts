import axios from "axios";
import { api } from "@/config/config";
import { BASE_URL } from "@/config/config";
import { InfoMessage } from "@/config/types";

export const registrateNewUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  dateOfBirth: string,
  password: string,
  address: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const result = await axios.post(`${BASE_URL}/auth/registration`, {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      password,
      address,
    });
    return "created";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else if (error.status === 400 || error.status === 409) {
        return error.response?.data;
      }
    }
  }
};

export const loginUser = async (
  email: string,
  password: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    if (response?.data?.accessToken && response?.data?.refreshToken) {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return response.status;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else if (error.status === 400 || error.status === 409) {
        return error.response?.data;
      }
    }
  }
};

export const activateAccount = async (
  token: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/activate/${token}`);
    const { accessToken, refreshToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    console.error("Error during account activation:", error);
  }
};

export const updateUser = async (userData: any): Promise<any> => {
  const res = await api.post(`/auth/update`, userData);
  return res.status;
};

export const updatePassword = async (newPassword: string): Promise<any> => {
  const res = await api.post(`/auth/update-password`, {
    password: newPassword,
  });
  return res;
};

export const updateRefreshToken = async (
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    console.error("Error refreshing token:", error);
  }
};

export const getUser = async (): Promise<any> => {
  const accessToken = localStorage.getItem("accessToken");

  const res = await api.get(`/auth/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const googleLogin = async (
  googleToken: any,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/google`, {
      token: googleToken,
    });
    if (response?.data?.accessToken && response?.data?.refreshToken) {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return response.status;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else if (error.status === 409 || error.status === 400) {
        return error.response?.data;
      }
    }
  }
};

// export const facebookLogin = async (facebookToken: string): Promise<any> => {
//   try {
//     const res = await axios.post(`${BASE_URL}/auth/facebook`, {
//       token: facebookToken,
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error during Facebook login:", error);
//   }
// };

export const linkAccount = async (
  type: string,
  token: any,
  email: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const res = await api.post(`${BASE_URL}/account/link-account`, {
      type: type,
      token: token,
      user: email,
    });
    return res.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else if (error.status === 409 || error.status === 400) {
        return error.response?.data;
      }
    }
  }
};

export const unlinkAccount = async (
  type: string,
  userEmail: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const res = await api.post(`${BASE_URL}/account/unlink-account`, {
      type: type,
      user: userEmail,
    });
    console.log(res);
    return res.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else if (error.status === 409 || error.status === 400) {
        return error.response?.data;
      }
    }
  }
};
