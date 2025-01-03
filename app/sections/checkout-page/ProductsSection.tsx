"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { useCart } from "@/hooks/useCart";
import { useAlert } from "@/hooks/alertContext";
import { CreateOrder } from "@/services/OrderService";
import { CreatePayment } from "@/services/PaymentService";
import CartProduct from "@/components/cart-component/CartProduct";

import Shipping from "@/images/checkout-section/shipping.svg";

const ProductsSection = ({
  basicInfo,
  shippingValue,
  paymentInfo,
}: {
  basicInfo: any;
  shippingValue: any;
  paymentInfo: any;
}) => {
  const { setInfoMessage } = useAlert();
  const { products, totalAmount } = useCart();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (
      Object.keys(basicInfo).length != 0 &&
      Object.keys(shippingValue).length != 0 &&
      paymentInfo != ""
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [basicInfo, shippingValue, paymentInfo]);

  const handleSubmit = async () => {
    if (!isDisabled) {
      if (paymentInfo === "" || products.length === 0) {
        console.error("Error");
      } else {
        if (paymentInfo === "Post") {
          const lineItems = products.map((product) => ({
            productId: product.id,
            title: product.title,
            priceSet: {
              shopMoney: {
                amount: product.price,
                currencyCode: "UAH",
              },
            },
            quantity: product.quantity,
          }));

          const data = {
            currency: "UAH",
            customerId: "",
            email: basicInfo.email,
            phone: basicInfo.phone,
            shippingAddress: {
              firstName: basicInfo.firstName,
              lastName: basicInfo.lastName,
              address1:
                shippingValue.street ||
                shippingValue.postomat ||
                shippingValue.department,
              address2: shippingValue.house + " , " + shippingValue.flat || "",
              city: basicInfo.city,
              zip: shippingValue.zipCode,
              countryCode: "UA",
            },
            shippingLines: [{
          title: "Nova Post" + shippingValue.selectedOption,
          priceSet:{
          	shopMoney:{
          		amount: 1.1, 
          		currencyCode: 'UAH'
          	}
          }
          }],
            lineItems: lineItems,
          };

          const response = await CreateOrder(data, {
            sendReceipt: "true",
            sendFulfillmentReceipt: "true",
            inventoryBehaviour: "BYPASS",
          }, setInfoMessage);
        } else if (paymentInfo === "LiqPay") {
          const result = await CreatePayment(totalAmount, basicInfo.email);
          if (result) {
            window.location.href = result;
          }
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sticky top-[15px] mini:mx-auto mini:w-[420px] md:w-[500px] lg:mx-0 lg:w-[350px] xl:w-[450px]">
        <motion.div
          className="bordered-[10px] shadow-lg rounded-lg px-[20px]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col gap-[12px] mb-[30px]">
            {products.map((product) => (
              <CartProduct key={product.id} card={product} />
            ))}
            {products.length === 0 && (
              <div className="flex my-[10px]">
                <Image src={Shipping} alt={Shipping} />
                <div className="flex flex-col justify-center ml-[20px]">
                  <p className="text-[14px] text-silver md:text-[16px]">
                    У вас немає товарів у кошику
                  </p>
                </div>
              </div>
            )}
          </ul>
        </motion.div>

        <div
          className={`flex flex-col bg-darkBurgundy py-[25px] rounded-[10px] text-white text-center items-center gap-[8px] ${
            isDisabled
              ? `bg-darkBurgundyOpacity cursor-not-allowed`
              : `hover:bg-darkMaroon cursor-pointer`
          } `}
          onClick={handleSubmit}
          id="payment-button-container"
        >
          <h2 className="text-[24px]">{totalAmount}₴</h2>
          <p>Сума</p>
        </div>
      </div>
    </>
  );
};

export default ProductsSection;
