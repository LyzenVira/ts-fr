"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, isEmail } from "@mantine/form";

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { sendResetPasswordEmail } from "@/services/ForgotMeService";
import ModalWindowComponent from "@/components/checkout-page/OrderingComponent";

import Background from "@/images/authorization-page/bg-geomitrical.svg";

const ForgotMeFormSection = () => {

  const [forgotMeMessage, setForgotMeMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { setInfoMessage } = useAlert();
  const forgotMeForm = useForm({
    initialValues: {
      email: ""
    },
    validate: {
      email: isEmail("Неправильний емайл"),
    },
  });

  const handleResetEmail = async () => {
    const errors = forgotMeForm.validate();
    if (!errors.hasErrors) {
      setIsLoading(true);
      const { email } = forgotMeForm.values;
      const response = await sendResetPasswordEmail(email,setInfoMessage);
      setIsLoading(false);
      if (response === 200) {
        setIsModalVisible(true);
        forgotMeForm.reset();
      } else if (response == "No user found with this email address") {
        setForgotMeMessage("Користувач з такою електронною поштою не існує. Спробуйте знову");
      }
    }
  };

  return (
    <>
     {isModalVisible && (
        <ModalWindowComponent
          title="Лист надісланий"
          message="Будь ласка, перевірте вашу поштову скриньку та перейдіть по посиланню в надісланому вам листі, щоб відновити пароль"
        />
      )}
      <section className="relative flex justify-center items-center font-poppins">
        <div className="bg-darkMaroon h-[500px] w-full absolute bottom-0 z-0">
          <Image
            src={Background}
            alt="Background"
            className="w-full h-full"
            fill
            objectFit="cover"
            loading="lazy"
          />
        </div>
        <form className="flex flex-col bg-snow w-[350px] md:w-[600px] lg:w-[860px] ring-[20px] ring-snow text-center border-[2px] border-gray-300 rounded-[10px] z-10 px-[20px] lg:px-[110px] mb-[174px]">
          {isLoading && <LoaderComponent />}

          <div className="text-center mb-[26px] mt-[40px]">
            <h2 className="text-[24px] md:text-[32px] lg:text-[48px] lg:mt-[20px] text-darkMaroon font-bold mb-[20px]">
              ЗАБУЛИ ПАРОЛЬ
            </h2>
            <p className="leading-[2] text-silver text-[14px] md:text-[16px]">
              Введіть вашу електронну адресу, після цього ми надішлимо вам листа з посилання, щоб відновити пароль
            </p>
          </div>

          <Input
            inputType="input"
            placeholder="Email"
            type="email"
            required={true}
            fullWidth={true}
            className="!w-full"
            errorType="critical"
            {...forgotMeForm.getInputProps("email")}
            bordered={true}
          />

          <div className=" mt-[26px]">
            <div>
              {forgotMeMessage && (
                <span
                  className={`block text-center text-[16px] text-darkBurgundy`}
                >
                  {forgotMeMessage}
                </span>
              )}
            </div>

            <Button
              text="Відправити"
              type="button"
              className="!w-[208px] mx-auto mt-[8px] mb-[46px]"
              onClick={handleResetEmail}
            />
          </div>
        </form>
      </section>
    </>
  );
};

export default ForgotMeFormSection;
