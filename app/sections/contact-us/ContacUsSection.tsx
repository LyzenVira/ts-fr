"use client";
import Image from "next/image";
import { Alert } from "flowbite-react";
import { motion } from "framer-motion";
import { TfiAlert } from "react-icons/tfi";
import { FiCheckCircle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { hasLength, isEmail, useForm } from "@mantine/form";

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { sendEmailToUs } from "@/services/SubscribeService";

import Message from "@/images/contact-us/message.svg";
import ContactUsImage from "@/images/contact-us/contact-us.jpg";
import Link from "next/link";

const ContactUsSection = () => {
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
  const [showCloud, setShowCloud] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023.99);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const footerElement = document.querySelector("footer");
      if (footerElement) {
        const footerPosition = footerElement.getBoundingClientRect().top;
        if (footerPosition <= window.innerHeight) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloud(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      message: "",
    },
    validate: {
      fullName: hasLength(
        { min: 3 },
        "Full Name must be at least 3 characters"
      ),
      email: isEmail("Invalid email"),
      message: hasLength({ min: 4 }, "Message must have at least 6 characters"),
    },
  });

  useEffect(() => {
    const savedAttempts = localStorage.getItem("contactUsAttempts");
    const savedTime = localStorage.getItem("contactUsTime");

    if (savedAttempts && savedTime) {
      const parsedAttempts = Number(savedAttempts);
      const lastAttemptTime = Number(savedTime);
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastAttemptTime;

      if (timeElapsed > 96 * 60 * 60 * 1000) {
        setAttempts(0);
        localStorage.setItem("contactUsAttempts", "0");
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const errors = form.validate();
    if (Object.keys(errors.errors).length > 0) {
      return;
    }
    setIsLoading(true);
    const values = form.values;
    const response = await sendEmailToUs(
      values.fullName,
      values.email,
      values.message,
      setInfoMessage
    );

    if (response === 200) {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Повідолмення успішно відправлено!",
      });
    }

    if (attempts < MAX_ATTEMPTS) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("contactUsAttempts", newAttempts.toString());
      localStorage.setItem("contactUsTime", new Date().getTime().toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsDisabled(true);
      }
    }

    setIsLoading(false);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    form.reset();
    setValue("");
  };

  return (
    <>
      {message && (
        <Alert
          color={message.type === "success" ? "green" : "red"}
          icon={message.type === "success" ? FiCheckCircle : TfiAlert}
          className={`fixed bottom-0 right-0 m-4 p-4 z-10 lg:text-[18px] ${
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
      <section className="lg:bg-pearl py-[20px]">
        <div className="container relative flex flex-col items-center mt-[30px] mb-[60px] gap-[50px] lg:gap-0 lg:justify-between lg:flex-row">
          <div className="flex flex-col gap-[30px] items-center justify-center lg:w-[45%] xl:w-[55%]">
            <div>
              <h1 className="font-frontrunner text-center text-black text-[28px] mb-[15px] md:text-[32px] md:mb-[20px] lg:text-start lg:text-[42px] lg:mb-[25px]">
                Зв'яжіться з нами
              </h1>
              <p className="text-center text-[#424551] font-poppins text-silver lg:text-start">
                Якщо у вас є запитання, пропозиції або вам потрібна допомога,
                будь ласка, зв'яжіться з нами. Ми завжди раді допомогти вам!
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center gap-[30px] lg:items-start"
            >
              {isDisabled ? (
                <p className="text-red-500">Ви вичерпали всі спроби!</p>
              ) : (
                attempts > 0 &&
                attempts < MAX_ATTEMPTS && (
                  <p className="text-black">
                    Залишилось спроб: {MAX_ATTEMPTS - attempts}
                  </p>
                )
              )}
              <div className="w-full flex flex-col gap-[14px]">
                <Input
                  inputType="input"
                  placeholder="Ім'я"
                  required={true}
                  bordered={true}
                  className=" lg:w-[90%] xl:w-[70%] "
                  errorType="critical"
                  disabled={isDisabled}
                  {...form.getInputProps("fullName")}
                />

                <Input
                  inputType="input"
                  required={true}
                  bordered={true}
                  placeholder="Email"
                  type="email"
                  className="lg:w-[90%] xl:w-[70%] "
                  errorType="critical"
                  disabled={isDisabled}
                  {...form.getInputProps("email")}
                />

                <Input
                  inputType="textarea"
                  type="text"
                  placeholder="Повідомлення"
                  required={true}
                  bordered={true}
                  className="focus:outline-none focus:border-[1px] focus:border-darkBurgundy"
                  {...form.getInputProps("message")}
                  errorType="critical"
                  disabled={isDisabled}
                />
              </div>
              <Button
                text="Відправити "
                background="darkBurgundy"
                disabled={isDisabled}
                type="submit"
                tag="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              />
            </form>
          </div>
          <div
            className={`hidden cursor-pointer absolute py-[11px] px-[17px] transition duration-300 rounded-full left-[49%] top-[45%] lg:block xl:py-[15px] xl:px-[21px] xl:left-[58%] xl:top-[40%] group ${
              showCloud
                ? "bg-blue-500 hover:bg-blue-600 transition duration-300 ease-out"
                : "bg-darkBurgundy"
            }`}
          >
            {showCloud && (
              <motion.div
                className="absolute lg:left-[80%] lg:top-[-80%] xl:right-[-230%] xl:top-[-70%] bg-white text-darkBurgundy p-3 rounded-lg shadow-lg w-[250px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-sm font-medium">
                  Напишіть нам у Telegram для швидкої допомоги!
                </p>
              </motion.div>
            )}
            <Link
              href="https://t.me/Montre_dArt_bot"
              target="_blank"
              className=""
            >
              <Image
                src={Message}
                alt="message"
                className="lg:w-[40px] lg:h-[53px] transition-transform duration-300"
                width={60}
                height={71}
              />
            </Link>
          </div>
          <div className="w-[90%] lg:w-[47%] xl:w-[50%] flex justify-end">
            <Image
              src={ContactUsImage}
              alt="contact us"
              className="object-cover w-[100%] lg:w-[500px] xl:w-[500px] rounded-lg"
              height={540}
              width={640}
              loading="lazy"
            />
          </div>
        </div>

        {isMobile && showButton && (
          <div className="fixed bottom-3 right-3 z-10">
            <div
              className={`cursor-pointer py-1 px-3 md:py-3 md:px-3 transition duration-300 rounded-full ${
                showCloud
                  ? "bg-blue-500 hover:bg-blue-600 transition duration-300 ease-out"
                  : "bg-darkBurgundy"
              }`}
            >
              {showCloud && (
                <motion.div
                  className="absolute left-[-370%] border bottom-10 md:bottom-[70%] bg-white text-darkBurgundy p-2 rounded-lg shadow-lg w-[185px] md:w-[240px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-[11px] md:text-[14px] font-medium">
                    Напишіть нам у Telegram для швидкої допомоги!
                  </p>
                </motion.div>
              )}
              <Link href="https://t.me/Montre_dArt_bot" target="_blank">
                <Image
                  src={Message}
                  alt="message"
                  className="w-6 h-10 md:w-10 md:h-10 transition-transform duration-300"
                  width={40}
                  height={53}
                />
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ContactUsSection;
