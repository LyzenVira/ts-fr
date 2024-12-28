"use client";
import { Alert } from "flowbite-react";
import { TfiAlert, TfiClose } from "react-icons/tfi";
import { FiCheckCircle } from "react-icons/fi";
import React, { createContext, useContext, useState } from "react";

import { InfoMessage } from "@/config/types";
import { IconBase } from "react-icons/lib";

type AlertContextType = {
  infoMessage: InfoMessage | null;
  setInfoMessage: (message: InfoMessage | null) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [infoMessage, setInfoMessage] = useState<InfoMessage | null>(null);
  const closeAlert = () => setInfoMessage(null);
  return (
    <AlertContext.Provider value={{ infoMessage, setInfoMessage }}>
      {children}
      {infoMessage && (
        <Alert
        onDismiss={closeAlert}
        theme={{
          closeButton: {
            base: "absolute right-0 top-0 rounded-md py-2 px-1",
            icon: "w-5 h-5 text-red-300 hover:text-black-700",
          },
        }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            paddingRight:"25px"
          }}
          color={infoMessage.type === "success" ? "green" : "red"}
          className={`fixed bottom-0 right-0 m-4 p-4 z-10 text-[16px] lg:text-[18px] ${
            infoMessage.type === "success" ? "text-[green]" : "text-[red]"
          }`}
        >
          <div className="flex items-center space-x-2 ">
            {infoMessage.type === "success" ? <FiCheckCircle /> : <TfiAlert />}
            <span>{infoMessage.text}</span>
          </div>
        </Alert>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
