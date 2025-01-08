"use client";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useForm,isEmail } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google"
// import FacebookLogin from 'react-facebook-login';

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { googleLogin, loginUser } from "@/services/AuthService";

const LoginFormSection = () => {
  const router = useRouter();
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const { setInfoMessage } = useAlert();

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Неправильна електронна пошта"),
      password: (value) => {
        if (/\s/.test(value)) return "Пароль не повинен містити пробілів";
        if (value.length < 6) return "Пароль повинен мати не меньше 6 символів";
        if (value.length > 20)
          return "Пароль повинен мати не більше 20 символів";
      },
    },
  });

  useEffect(() => {
    const tokenAccess = localStorage.getItem("accessToken");
    const tokenRefresh = localStorage.getItem("refreshToken");

    if (tokenAccess || tokenRefresh) {
      router.push("/account");
    }

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      loginForm.setFieldValue("email", savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async () => {
    const errors = loginForm.validate();
    if (!errors.hasErrors) {
      setIsLoading(true);
      const { email, password } = loginForm.values;

      if (!rememberMe) {
        localStorage.removeItem("rememberedEmail");
      }
      const response = await loginUser(email, password,setInfoMessage);

      setIsLoading(false);
      if (response === 200) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }
        loginForm.reset();
        router.push("/account");
        setLoginMessage(null);
      } else if (response == "A user with this email address already exists") {
        setLoginMessage("Користувач з такою електронною адресою уже існує. Спробуйте знову");
      } else if (response == "The password is incorrect") {
        setLoginMessage("Некоректний пароль. Спробуйте знову");
      } else if (response == "User not activated") {
        setLoginMessage("Ваш аккаунт не активований. Перевірьте вашу електронну скриньку");
      }
      else{
        setLoginMessage("Користувача з такою електронною адресою не існує.");
      }
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      await handleGoogle(tokenResponse);
    },
    onError: () => setLoginMessage("Login with Google failed"),
  });

  const handleGoogle = async (tokenResponse: TokenResponse) => {
    setIsLoading(true);
    const response = await googleLogin(tokenResponse);
    setIsLoading(false);
    if (response === 200) {
      loginForm.reset();
      router.push("/account");
      setLoginMessage(null);
    } else if (response === "Error with google server") {
      setLoginMessage("Помилка сервера Google.");
    } else if (response === "Can not login with google") {
      setLoginMessage("Увійти через Google неможливо. Спробуйте увійти за допомогою пароля.");
    } else if (response == "A user with this email address already exists") {
      setLoginMessage("Увійти через Google неможливо. Спробуйте увійти за допомогою пароля.");
    } else {
      setLoginMessage("Помилка сервера.");
    }
  };

  return (
    <>
      {isLoading && <LoaderComponent />}

      <div className="text-center mb-[48px]">
        <h2 className="text-[24px] md:text-[32px] lg:text-[48px] lg:mt-[20px] text-darkMaroon font-bold mb-[20px]">
		  Ласкаво просимо! Увійдіть до свого акаунта
        </h2>
        <p className="leading-[2] text-silver text-[14px] md:text-[16px]">
		  Увійдіть у свій існуючий акаунт, щоб перевіряти поточні замовлення та більше
        </p>
      </div>
      <div className="flex flex-col gap-[10px]">
        <Input
        inputType="input"
        placeholder="Електронна пошта"
        type="email"
        required={true}
        fullWidth={true}
        className="!w-full"
        errorType="critical"
        {...loginForm.getInputProps("email")}
        bordered={true}
      />

      <Input
        inputType="password"
        visible={visible}
        onVisibilityChange={toggle}
        placeholder="Пароль"
        type="password"
        bordered={true}
        fullWidth={true}
        required={true}
        errorType="critical"
        {...loginForm.getInputProps("password")}
        className="!w-full"
      />
      </div>
      

      <div className="mt-[20px] flex justify-between text-silver">
        <div className="flex gap-[10px]">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-[20px] h-[20px] appearance-none border-2 border-gray-400 rounded-sm cursor-pointer checked:bg-darkBurgundy checked:border-darkBurgundy checked:after:content-['✔'] checked:after:flex checked:after:justify-center checked:after:items-center checked:after:w-full checked:after:h-full checked:after:text-white focus:outline-none focus:ring-0"
          />
          <label htmlFor="rememberMe" className="cursor-pointer">
            Запам'ятати мене
          </label>
        </div>
        <div
          className="cursor-pointer hover:underline"
          onClick={() => router.push("/auth/forgot-me")}
        >
          Забули пароль
        </div>
      </div>

      <div className=" mt-[16px]">
        <div>
          {loginMessage && (
            <span className={`block text-center text-[16px] text-darkBurgundy`}>
              {loginMessage}
            </span>
          )}
        </div>

        <Button
          text="Увійти"
          type="button"
          className="!w-[208px] mx-auto mt-[8px]"
          onClick={handleSignIn}
        />

        <p className="mt-[28px] font-bold text-[20px]">Швидка авторизація</p>

        <div className="mt-[18px] mb-[46px] flex flex-col lg:flex-row gap-[10px] text-[20px] font-bold">
          <Button
            text="Google"
            type="button"
            className="!w-[312px] h-[56px] mx-auto"
            icon="google"
            onClick={handleGoogleSignIn}
          />
           {/* <Button
            text="Facebook"
            type="button"
            className="!w-[312px] h-[56px] mx-auto"
            icon="facebook"
            onClick={handleFacebookSignIn}
          /> */}
        </div>
      </div>
    </>
  );
};

export default LoginFormSection;
