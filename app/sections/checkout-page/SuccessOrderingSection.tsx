"use client";
import Image from "next/image";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { MantineProvider, Modal } from "@mantine/core";

import Button from "@/components/ButtonComponent";

import Thanks from "@/images/checkout-page/Thanks.png";

const SuccessOrderingSection = ({ orderId }: { orderId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
      open();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (opened) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [opened]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ReactConfetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
      />
      {showModal && (
        <>
          {ReactDOM.createPortal(
            <MantineProvider>
              {opened && (
                <div className="fixed inset-0 bg-[grey] bg-opacity-30 backdrop-blur-sm z-50" />
              )}

              <Modal
                opened={opened}
                onClose={close}
                className="container"
                withCloseButton={false}
                classNames={{
                  root: "top-[10%] md:top-[5%] z-[1000] absolute left-0 right-0 bottom-0 md:w-[80%] lg:w-[51%]",
                  body: "p-0",
                }}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 50 }}
                >
                  <div className="flex flex-col items-center bg-white rounded-[32px] pt-[40px] ">
                    <h1 className="font-frontrunner text-center text-black text-[30px] md:text-[40px] md:mb-[20px] lg:text-[45px] px-[10px]">
                      Дякуємо за ваше замовлення!
                    </h1>
                    <p className="text-center font-poppins text-[silver] text-[18px] px-[15px]  mt-[5px] md:mt-0">
                      Ваше замовлення
                      <span> </span>
                      <span className="font-semibold underline text-darkBurgundy">№{orderId}</span>
                      <span> </span>
                      успішно оброблено. Очікуйте підтвердження найближчим
                      часом.
                    </p>
                    <Button
                      href="/"
                      tag="a"
                      text="Повернутись на головну сторінку"
                      className="mt-[20px] md:mt-[40px] mb-[10px] focus:outline-none focus:ring-0"
                    />
                    <Image
                      src={Thanks}
                      alt="thanks"
                      className="object-cover rounded-[32px]"
                    />
                  </div>
                </motion.div>
              </Modal>
            </MantineProvider>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default SuccessOrderingSection;
