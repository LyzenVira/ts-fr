"use client";
import { useForm } from "@mantine/form";
import { Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Background from "@/images/authorization-page/bg-geomitrical.svg";
import Image from "next/image";
import Button from "@/components/ButtonComponent";
import Input from "@/components/InputComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { useDisclosure } from "@mantine/hooks";
import {
  checkResetToken,
  resetForgetPassword,
} from "@/services/ForgotMeService";
import { useRouter } from "next/navigation";

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
  // const [isLoadin, setIsLoading] =
  const resetPasswordForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validate: {
      password: (value) => {
        if (/\s/.test(value)) return "Password must not contain spaces";
        if (/[\u0400-\u04FF]/.test(value))
          return "Cyrillic characters are not allowed";
        if (value.length < 6) return "Minimum 6 characters required";
        if (value.length > 20) return "Maximum 20 characters allowed";
        if (!/[a-z]/.test(value))
          return "Password must contain lowercase letter";
        if (!/[A-Z]/.test(value))
          return "Password must contain uppercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain digit";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords must match" : null,
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoader(true);
        const res = await checkResetToken(resetPasswordToken);
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
      const response = await resetForgetPassword(resetPasswordToken, password);
      setIsLoading(false);
      if (response === 200) {
        resetPasswordForm.reset();
        router.push("/auth");
      } else if (response == "No user found with this reset token") {
        setForgotMeMessage("User not found. Try again.");
      } else if (response == "Can not set same password") {
        setForgotMeMessage("The password should be different.");
      } else {
        setForgotMeMessage("Error with server.");
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
                RESET PASSWORD
              </h2>
              <p className="leading-[2] text-silver">Enter your new password</p>
            </div>

            <Input
              inputType="password"
              placeholder="Password"
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
              placeholder="Confirm Password"
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
                text="Reset Password"
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
            <p className="mt-[20px] text-[24px]">Your token expired !</p>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPasswordFormSection;
