import React from "react";

import Image from "next/image";

import { CartProductProps } from "@/config/types";
import { useCart } from "@/hooks/useCart";

import Delete from "@/images/cart-component/delete.svg";

const CartProduct = ({ card }: { card: CartProductProps }) => {
  const {
    products,
    addQuantity,
    removeQuantity,
    removeFromCart,
    changeOpenState,
  } = useCart();

  const onHandleClickDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();

    removeFromCart(id);

    products.length == 1 && changeOpenState(false);
  };

  const onHandleClickAddQuantity = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();

    addQuantity(id);
  };

  const onHandleClickRemoveQuantity = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    removeQuantity(id);
  };

  return (
    <li className="text-black pb-[15px] border-b border-[#ECEDF1] flex gap-[15px] items-center">
      <Image
        src={card.image}
        alt={`${card.title} - photo`}
        width={88}
        height={103}
        className="object-cover rounded-md w-[88px] h-[103px]"
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h4 className="text-silver">{card.title}</h4>
          <button onClick={(e) => onHandleClickDelete(e, card.id)}>
            <Image
              src={Delete}
              alt="delete button"
              className="object-fit h-5 w-5 hover:scale-110 duration-300"
            />
          </button>
        </div>

        <span className="text-black text-[20px] mb-[15px]">₴{card.price}</span>

        <div className="flex items-center border-2 rounded-md w-fit overflow-hidden">
          <button
            disabled={card.quantity <= 1}
            onClick={(e) => onHandleClickRemoveQuantity(e, card.id)}
            className={`w-8 h-8 rounded-sm border-r-2 
              ${
                card.quantity > 1 ? "hover:bg-darkBurgundy hover:text-snow bg-snow" : "bg-gray-200 bg-opacity-80 cursor-not-allowed text-[gray]"
              }`}
          >
            -
          </button>
          <span className="w-8 h-8 rounded-sm  flex items-center justify-center">
            {card.quantity}
          </span>
          <button
          disabled={card.quantity >= card.maxQuantity}
            onClick={(e) => onHandleClickAddQuantity(e, card.id)}
            className={`w-8 h-8 rounded-sm border-l-2  ${
              card.quantity < card.maxQuantity
                ? "hover:bg-darkBurgundy hover:text-snow bg-snow" : "bg-gray-200 bg-opacity-80 cursor-not-allowed text-[gray]"
            }`}
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartProduct;
