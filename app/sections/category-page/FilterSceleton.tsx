import React, { FC } from "react";

const FiltersSkeleton: FC = () => {
  return (
    <>
      <div className="hidden xl:flex flex-col gap-10 w-[480px]  pt-[43px] pb-[93px] pl-[30px] pr-[50px] bg-white rounded-md shadow-md">
        <div>
          <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex gap-2 items-center">
            <div className="animate-pulse h-8 w-full bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[50px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex gap-2">
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex gap-2 items-center">
            <div className="animate-pulse h-8 w-[160px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-1 w-[20px] bg-gray-300"></div>
            <div className="animate-pulse h-8 w-[160px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[50px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-2/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-full bg-gray-300 rounded-sm"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-2/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-full bg-gray-300 rounded-sm"></div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="animate-pulse h-10 w-[160px] bg-gray-300 rounded-md"></div>
          <div className="animate-pulse h-10 w-full bg-gray-300 rounded-md"></div>
        </div>
      </div>

      <div className="flex w-full justify-between absolute items-center bg-pearl px-5 gap-2 xl:hidden lg:px-[125px] md:px-[75px] py-[22px] z-20">
        <div className="animate-pulse h-[30px] w-[40%] bg-gray-300 rounded-md"></div>
        <div className="animate-pulse h-[55px] w-[55px] bg-gray-300 rounded-md"></div>
      </div>
    </>
  );
};

export default FiltersSkeleton;
