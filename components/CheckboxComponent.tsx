import React, { FC, ReactNode } from "react";

interface checkboxProps {
  className?: string;
  label: string;
  description: string;
  price?: string;
  checked?: boolean;
  children?: ReactNode;
  onChange?: () => void;
}

const CheckboxComponent: FC<checkboxProps> = ({
  className,
  label,
  description,
  price,
  checked,
  children,
  onChange,
}) => {
  return (
    <div className="flex flex-col my-[10px] mx-[10px] py-[30px] px-[25px] border-[1px] border-silver rounded cursor-pointer w-[100%] mini:w-[80%]">
      <div className="flex items-center" onClick={onChange}>
        <input
          type="radio"
          className="w-[25px] h-[25px] accent-darkBurgundy"
          checked={checked}
          onChange={onChange}
        />

        <div className="flex flex-col gap-[7px] ml-[15px] lg:flex-row lg:items-center lg:justify-between w-full">
          <div className=" text-[14px] md:text-[16px] xl:text-[18px]">
            <p className="whitespace-nowrap">{label}</p>
            <p className={`text-silver ${className}`}>{description}</p>
          </div>

          <p className="whitespace-nowrap md:text-[16px] xl:text-[18px]">{price}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CheckboxComponent;
