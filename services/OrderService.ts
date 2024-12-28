import axios from "axios";
import { api } from "@/config/config";
import { BASE_URL } from "@/config/config";
import { InfoMessage } from "@/config/types";

export const CreateOrder = async (
  order: any,
  options: any,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const data = { order, options };

    const res = await axios.post(`${BASE_URL}/order`, data);
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
    console.error("Error create order:", error);
  }
};
export const getUserOrders = async (): Promise<any> => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await api.get(`/order`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
