import React, { FC, useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Arrow from "@/images/news-section/arrow.svg";

interface formProps {
  className?: string;
  title: string;
  isOpen?: boolean;
  children?: ReactNode;
  closeText?: string | null;
  toggleOpen?: () => void;
}

const FormComponent: FC<formProps> = ({
  className,
  title,
  children,
  isOpen,
  closeText,
  toggleOpen,
}) => {
  return (
    <div
      className={`${className} rounded-[5px] border-[1px] border-whisper w-full justify-center mx-auto lg:mx-0 bg-pearl md:w-[500px] mini:w-[420px] lg:w-full`}
    >
      <p className="mx-[30px] my-[25px] flex justify-between" onClick={toggleOpen}>
        <span className="font-semibold lg:text-[18px]">{title}</span>
        <Image
          src={Arrow}
          alt="Arrow"
          className={`cursor-pointer transition-transform  ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>

      <div
        className={`transition-all duration-1000 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form
          className={`${className} mini:mx-0 mx-[30px] pb-[40px] flex flex-col gap-y-[15px]`}
        >
          {children}
        </form>
      </div>

      {!isOpen && <p className="mx-[30px] mb-[20px] text-silver">{closeText}</p>}
    </div>
  );
};

export default FormComponent;
