"use client";
import Image from "next/image";
import { Alert } from "flowbite-react";
import { TfiAlert } from "react-icons/tfi";
import { FiCheckCircle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { hasLength, isEmail, useForm } from "@mantine/form";

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { addNewReceiver } from "@/services/SubscribeService";

import Background from "@/images/news-section/subscribe.svg";

const NewsSection = () => {
  const MAX_ATTEMPTS = 3;
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const { setInfoMessage } = useAlert();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      name: hasLength({ min: 3 }, "Ім'я повинно містити не менше 3 символів"),
      email: isEmail("Невірний email"),
    },
  });

  useEffect(() => {
    const savedAttempts = localStorage.getItem("inputAttempts");
    const savedTime = localStorage.getItem("inputAttemptsTime");

    if (savedAttempts && savedTime) {
      const parsedAttempts = Number(savedAttempts);
      const lastAttemptTime = Number(savedTime);
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastAttemptTime;

      if (timeElapsed > 96 * 60 * 60 * 1000) {
        setAttempts(0);
        localStorage.setItem("inputAttempts", "0");
      } else {
        setAttempts(parsedAttempts);
      }

      if (parsedAttempts >= MAX_ATTEMPTS) {
        setIsDisabled(true);
      }
    } else {
      setAttempts(0);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const errors = form.validate();
    if (Object.keys(errors.errors).length > 0) {
      return;
    }

    const values = form.values;

    const response = await addNewReceiver(
      values.name,
      values.email,
      setInfoMessage
    );

    if (attempts < MAX_ATTEMPTS) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("inputAttempts", newAttempts.toString());
      localStorage.setItem(
        "inputAttemptsTime",
        new Date().getTime().toString()
      );
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsDisabled(true);
      }
    }

    if (response === 201) {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Ви  успішно підписалися на нашу розсилку!",
      });
      setValue("");
    } else if (response === 400) {
      setIsLoading(false);
      setValue("Цей email вже існує!");
    }

    setIsLoading(false);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    form.reset();
  };

  return (
    <>
      {message && (
        <Alert
          color={message.type === "success" ? "green" : "red"}
          icon={message.type === "success" ? FiCheckCircle : TfiAlert}
          className={`fixed bottom-0 right-0 m-4 p-4 z-10 text-[16px] lg:text-[18px] ${
            message.type === "success" ? "text-[green]" : "text-[red]"
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === "success" ? <FiCheckCircle /> : <TfiAlert />}
            <span>{message.text}</span>
          </div>
        </Alert>
      )}
      {isLoading && <LoaderComponent />}
      <section className="relative">
        <div className="container relative text-snow flex flex-col gap-[30px] items-center py-[60px] text-center">
          <h3 className="font-bold text-[22px] md:text-[30px] xl:text-[36px] xl:w-[80%]">
            Не втратьте можливість отримати подарунок! Підпишіться на нашу
            розсилку
          </h3>

          <p>
            Ми будемо інформувати вас про майбутні розіграші, пропозиції, хід
            підготовки онлайн-магазину та початок продажів
          </p>

          <form
            className="flex flex-col gap-[30px] items-center"
            onSubmit={handleSubmit}
          >
            {isDisabled ? (
              <p className="text-red-500">Ви вичерпали всі спроби!</p>
            ) : (
              attempts > 0 &&
              attempts < MAX_ATTEMPTS && (
                <p>Залишилось спроб: {MAX_ATTEMPTS - attempts}</p>
              )
            )}
            <div className="flex flex-col gap-[30px] xl:flex-row xl:gap-[20px]">
              <div className="flex flex-col">
                <Input
                  inputType="input"
                  required
                  placeholder="Ім'я"
                  type="text"
                  errorType="warning"
                  {...form.getInputProps("name")}
                  disabled={isDisabled}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  inputType="input"
                  required
                  placeholder="Email"
                  type="email"
                  errorType="warning"
                  {...form.getInputProps("email")}
                  disabled={isDisabled}
                />
              </div>
            </div>
            {value && <p className="text-snow">{value}</p>}
            <Button
              text="Підписатись"
              type="submit"
              tag="button"
              background="onyx"
              className="w-[160px]"
              disabled={isDisabled}
            />
          </form>

          <p>
            Ви погоджуєтесь з нашими
            <span> </span>
            <a href="/legal" className="font-medium underline">
              Умовами та положеннями
            </a>
          </p>
        </div>

        <Image
          src={Background}
          alt="Background"
          className="top-0 bg-darkBurgundyOpacity object-cover absolute -z-10 h-[100%] w-[100%]"
          loading="lazy"
        />
      </section>
    </>
  );
};

export default NewsSection;
