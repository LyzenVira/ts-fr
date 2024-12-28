import axios from "axios";
import { BASE_URL } from "@/config/config";

export const CreatePayment = async (
  totalAmount: number,
  senderEmail:string
): Promise<any> => {
  try {
    const data = await axios.post(
      `${BASE_URL}/create-payment`,
      {amount: totalAmount, orderId: `order_${new Date().getTime()}`}
    );

    return data.data;
  } catch (error) {
    console.error("Error during LiqPay payment creation:", error);
  }
};