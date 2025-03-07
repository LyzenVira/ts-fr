"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useDisclosure } from "@mantine/hooks";
import React, { FC, useState, useEffect } from "react";
import { Modal, Button, ActionIcon } from "@mantine/core";

import { useAlert } from "@/hooks/alertContext";
import MainButton from "@/components/ButtonComponent";
import { updateRefreshToken } from "@/services/AuthService";

import Logo from "@/images/logo.svg";
import Close from "@/images/vectors/close.svg";
import Burger from "@/images/vectors/burger.svg";
import Basket from "@/images/vectors/basket.svg";

const navData = [
  { link: "/#about-us", text: "Про нас" },
  { link: "/contact-us", text: "Контакти" },
  { link: "/legal", text: "Допомога" },
];

const Header = () => {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const { products, changeOpenState } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setInfoMessage } = useAlert();
  
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          if (accessToken) {
            setIsLoggedIn(true);
          } else {
            const tokens = await updateRefreshToken(setInfoMessage);
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchTokens();
  }, [pathname]);

  const HeaderNavigation: FC<{ className?: string }> = ({ className }) => {
    return (
      <div
        className={`${className} flex flex-col gap-[25px] items-center justify-center xl:flex-row `}
      >
        <div className="flex flex-col xl:flex-row gap-[40px] items-center">
          <nav className="flex flex-col text-silver text-center xl:flex-row ">
            {navData.map((item, index) => (
              <MainButton
                tag="a"
                background="transparent"
                key={index}
                text={item.text}
                href={item.link}
                onClick={() => {
                  close();
                }}
                className="hover:text-onyx hover:font-bold transition-all duration-300 transform hover:scale-105 xl:pr-0"
              />
            ))}
          </nav>

          <MainButton text="Годинники" tag="a" href="/catalog" />
        </div>

        <div className="flex gap-[25px]">
          <button
            className="relative transition-transform duration-300 hover:scale-125"
            onClick={(e) => {
              e.preventDefault();
              close();
              changeOpenState(true);
            }}
          >
            {products.length > 0 && (
              <div className="absolute rounded-full w-4 h-4 flex items-center justify-center text-[12px] bg-[red] text-white -right-3.5 -top-[3.2px]">
                {products.length}
              </div>
            )}
            <Image src={Basket} alt="Basket" />
          </button>
          {!isLoggedIn ? (
            <MainButton
              text="Увійти"
              tag="a"
              href="/auth"
              background="transparent"
              className="!px-[0px] !py-[6px] text-onyx font-semibold hover:text-onyx hover:font-bold transition-all duration-300 transform hover:scale-105"
            />
          ) : (
            <MainButton
              tag="a"
              icon="profile"
              background="transparent"
              href="/account"
              className="!px-[4px] !py-[2px] block transition-transform duration-300 hover:scale-125"
            />
          )}
        </div>
      </div>
    );
  };

  const HeaderLogo = () => {
    return (
      <Link href="/" onClick={close}>
        <Image src={Logo} alt="Logo" loading="lazy" />
      </Link>
    );
  };

  return (
    <header
      className={`px-[20px] lg:px-[60px] relative z-30 bg-white transition-transform transition-opacity duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center py-[20px] gap-[30px]">
        <HeaderLogo />

        <Button onClick={open} className="xl:hidden px-0 hover:bg-transparent">
          <Image src={Burger} alt="Burger" />
        </Button>

        <HeaderNavigation className="hidden xl:flex" />

        <Modal
          opened={opened}
          onClose={close}
          title=""
          fullScreen
          withCloseButton={false}
          radius={0}
          transitionProps={{ transition: "scale-x", duration: 200 }}
          className="xl:hidden"
          styles={{
            body: {
              padding: "0",
            },
            content: {
              backgroundColor: "#ffffff",
              zIndex: 9999,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            },
            header: {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <div className="container flex justify-between items-center py-[20px] mb-[40px]">
            <HeaderLogo />

            <ActionIcon
              variant="transparent"
              onClick={close}
              className="w-[24px] h-[24px]"
            >
              <Image src={Close} alt="Close" />
            </ActionIcon>
          </div>

          <HeaderNavigation />
        </Modal>
      </div>
    </header>
  );
};

export default Header;
