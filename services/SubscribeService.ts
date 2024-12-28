import axios from "axios";
import { BASE_URL } from "@/config/config";
import { InfoMessage } from "@/config/types";

export const addNewReceiver = async (
  name: string,
  email: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/newsletter/receiver`, {
      name,
      email,
    });

    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      } else {
        return error.status;
      }
    }
  }
};

export const sendEmailToUs = async (
  fullName: string,
  email: string,
  text: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/newsletter/contact-us`, {
      fullName,
      email,
      text,
    });

    return response.status;
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
  }
};

export const sendEmailNewsletter = async (
  subject: string,
  text: string,
  html: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/newsletter/send`, {
      subject,
      text,
      html,
    });
    return response.status;
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
  }
};

export const removeReceiver = async (
  email: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/newsletter/unsubscribe`, {
      params: { email },
    });
    return response.status;
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
  }
};
