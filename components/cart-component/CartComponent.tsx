"use client";

import Image from "next/image";

import Close from "@/images/cart-component/close.svg";
import CartProduct from "./CartProduct";
import Link from "next/link";

import { useCart } from "@/hooks/useCart";

const CartComponent = () => {
  const { products, totalAmount, isOpen, changeOpenState } = useCart();

  return (
    <div
      className={`bg-white text-white top-0 right-0 h-screen w-full md:w-[366px] shadow-lg z-[200] flex flex-col ${
        isOpen ? "fixed" : "hidden"
      }`}>
      <div className="bg-pearl flex items-center text-[24px] p-5">
        <h3 className="text-black font-frontrunner flex-1 text-center">
          Корзина
        </h3>
        <button
          className="ml-auto"
          onClick={(e) => {
            e.preventDefault();
            changeOpenState(false);
          }}>
          <Image
            src={Close}
            alt="close button"
            className="object-fit w-5 h-5"
          />
        </button>
      </div>

      <div className="px-5 pt-5 flex-1 overflow-y-scroll">
        <ul className="flex flex-col gap-3 mb-[30px]">
          {products.map((product) => (
            <CartProduct key={product.id} card={product} />
          ))}
        </ul>
      </div>

      <div className="py-6 px-5 bg-pearl flex flex-col gap-[16px] mt-auto">
        <ul className="flex flex-col text-silver gap-2">
          <li className="border-b border-[#ECEDF1] flex items-center justify-between">
            <p className="text-[16px]">Загальна сума</p>
            <span className="text-[22px] text-black font-normal">
				₴{totalAmount}
            </span>
          </li>
        </ul>

        <Link
          href={products.length > 0 ? "/checkout/#info" : "/catalog"}
          className="bg-darkBurgundy w-full rounded-[6px] focus:bg-darkMaroon text-center text-white py-[22px] hover:bg-darkMaroon transition-colors duration-300"
          onClick={() => {
            changeOpenState(false);
            setTimeout(() => {
              const info = document.getElementById("info");
              if (info) {
                info.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 300);
          }}>
          {products.length > 0 ? " Оформити замовлення" : "Перейти в каталог"}
        </Link>
      </div>
    </div>
  );
};

export default CartComponent;
