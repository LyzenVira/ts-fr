import axios from "axios";
import { BASE_URL } from "@/config/config";
import { InfoMessage } from "@/config/types";

export const sendResetPasswordEmail = async (
  email: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email,
    });
    return response.status;
  } catch (error) {
    console.error(error);
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

export const resetForgetPassword = async (
  token: string,
  password: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
      token,
      password,
    });
    return response.status;
  } catch (error) {
    console.error(error);
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

export const checkResetToken = async (
  token: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/reset-password/check-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else {
        return error;
      }
    }
  }
};
