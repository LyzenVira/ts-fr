"use client";
import Image from "next/image";
import { Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import {checkResetToken,resetForgetPassword} from "@/services/ForgotMeService";

import Background from "@/images/authorization-page/bg-geomitrical.svg";

const ResetPasswordFormSection = ({
  resetPasswordToken,
}: {
  resetPasswordToken: string;
}) => {
  const router = useRouter();
  const [forgotMeMessage, setForgotMeMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [visible, { toggle }] = useDisclosure(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const { setInfoMessage } = useAlert();

  const resetPasswordForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validate: {
      password: (value) => {
			if (/\s/.test(value)) return "Пароль не може містити пробілів";
			if (/[\u0400-\u04FF]/.test(value))
			  return "Не дозволяються кириличні символи";
			if (value.length < 6) return "Мінімум 6 символів";
			if (value.length > 20) return "Максимум 20 символів";
			if (!/[a-z]/.test(value))
			  return "Пароль повинен містити маленьку літеру";
			if (!/[A-Z]/.test(value))
			  return "Пароль повинен містити велику літеру";
			if (!/[0-9]/.test(value)) return "Пароль повинен містити цифру";
			return null;
		 },
		 confirmPassword: (value, values) =>
			value !== values.password ? "Паролі повинні співпадати" : null,		 
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoader(true);
        const res = await checkResetToken(resetPasswordToken, setInfoMessage);
        if (res === true) {
          setIsTokenValid(true);
          setIsLoader(false);
        } else {
          setIsLoader(false);
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Invalid reset token", error);
        setIsLoader(false);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [resetPasswordToken]);

  const handleResetPassword = async () => {
    const errors = resetPasswordForm.validate();
    if (!errors.hasErrors) {
      setIsLoading(true);
      const { password } = resetPasswordForm.values;
      const response = await resetForgetPassword(
        resetPasswordToken,
        password,
        setInfoMessage
      );
      setIsLoading(false);
      if (response === 200) {
			resetPasswordForm.reset();
			router.push("/auth");
		 } else if (response == "No user found with this reset token") {
			setForgotMeMessage("Користувача не знайдено. Спробуйте ще раз.");
		 } else if (response == "Can not set same password") {
			setForgotMeMessage("Пароль повинен відрізнятися.");
		 }		 
    }
  };

  return (
    <>
      {isLoader ? (
        <div className="container flex justify-center">
          <Loader className="animate-spin rounded-full border-4 border-darkBurgundy border-b-transparent w-10 h-10" />
        </div>
      ) : isTokenValid ? (
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
                ВІДНОВЛЕННЯ ПАРОЛЮ
              </h2>
              <p className="leading-[2] text-silver text-[14px] md:text-[16px]">Введіть ваш новий пароль</p>
            </div>

            <Input
              inputType="password"
              placeholder="Новий пароль"
              type="password"
              visible={visible}
              onVisibilityChange={toggle}
              bordered={true}
              fullWidth={true}
              required={true}
              errorType="critical"
              {...resetPasswordForm.getInputProps("password")}
              className="!w-full mt-[10px]"
            />
            <Input
              inputType="password"
              placeholder="Підтвердіть пароль"
              type="password"
              visible={visible}
              onVisibilityChange={toggle}
              bordered={true}
              fullWidth={true}
              required={true}
              errorType="critical"
              {...resetPasswordForm.getInputProps("confirmPassword")}
              className="!w-full mt-[10px]"
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
                text="Відновити пароль"
                type="button"
                className="!w-[208px] mx-auto mt-[8px] mb-[46px]"
                onClick={handleResetPassword}
              />
            </div>
          </form>
        </section>
      ) : (
        <>
          {" "}
          <div className="container flex justify-center">
            <p className="mt-[20px] text-[24px]">Час вашого токена сплинув!</p>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPasswordFormSection;
