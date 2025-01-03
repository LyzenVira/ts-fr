"use client";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import { useForm, isEmail, hasLength } from "@mantine/form";

import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";
import { registrateNewUser } from "@/services/AuthService";
import { addNewReceiver } from "@/services/SubscribeService";
import ModalWindowComponent from "@/components/checkout-page/OrderingComponent";

const months = [
  { value: "january", label: "Січень" },
  { value: "february", label: "Лютий" },
  { value: "march", label: "Березень" },
  { value: "april", label: "Квітень" },
  { value: "may", label: "Травень" },
  { value: "june", label: "Червень" },
  { value: "july", label: "Липень" },
  { value: "august", label: "Серпень" },
  { value: "september", label: "Вересень" },
  { value: "october", label: "Жовтень" },
  { value: "november", label: "Листопад" },
  { value: "december", label: "Грудень" },
];

const getDaysInMonth = (month: string): { value: string; label: string }[] => {
  const daysInMonthMap: { [key: string]: number } = {
    january: 31,
    february: 29,
    march: 31,
    april: 30,
    may: 31,
    june: 30,
    july: 31,
    august: 31,
    september: 30,
    october: 31,
    november: 30,
    december: 31,
  };

  const daysInMonth = daysInMonthMap[month] || 31;

  return Array.from({ length: daysInMonth }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: String(i + 1),
  }));
};

const validOperators = [
  "067",
  "068",
  "096",
  "097",
  "098",
  "099",
  "063",
  "073",
  "093",
  "050",
  "066",
  "095",
  "091",
  "092",
  "094",
  "089",
  "093",
];

const RegistrationFormSection = () => {
  const MAX_ATTEMPTS = 5;
  const [attempts, setAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const dayOptions = getDaysInMonth(month);
  const [visible, { toggle }] = useDisclosure(false);
  const { setInfoMessage } = useAlert();
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const registrationForm = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      month: "",
      date: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      receiveUpdates: false,
      registrationMessage: "",
    },
    validate: {
      firstName: hasLength({ min: 2 }, "Має бути не менше 2 символів"),
      lastName: hasLength({ min: 2 }, "Має бути не менше 2 символів"),
      email: isEmail("Невірна електронна адреса"),
      confirmEmail: (value, values) =>
        value !== values.email ? "Електронні адреси повинні співпадати" : null,
      password: (value) => {
        if (/\s/.test(value)) return "Пароль не може містити пробілів";
        if (/[\u0400-\u04FF]/.test(value))
          return "Не дозволяються кириличні символи";
        if (value.length < 6) return "Мінімум 6 символів";
        if (value.length > 20) return "Максимум 20 символів";
        if (!/[a-z]/.test(value))
          return "Пароль повинен містити маленьку літеру";
        if (!/[A-Z]/.test(value)) return "Пароль повинен містити велику літеру";
        if (!/[0-9]/.test(value)) return "Пароль повинен містити цифру";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Паролі повинні співпадати" : null,
      phone: (value) => {
        const operatorCode = registrationForm.values.phone.slice(3, 6);
        if (
          !/^\+38\d{10}$/.test(value) ||
          !validOperators.includes(operatorCode)
        ) {
          return "Некоректний номер телефону";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    const savedAttempts = localStorage.getItem("inputRegistrationAttempts");
    const savedTime = localStorage.getItem("inputRegistrationTime");

    if (savedAttempts && savedTime) {
      const parsedAttempts = Number(savedAttempts);
      const lastAttemptTime = Number(savedTime);
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastAttemptTime;

      if (timeElapsed > 96 * 60 * 60 * 1000) {
        setAttempts(0);
        localStorage.setItem("inputRegistrationAttempts", "0");
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

  useEffect(() => {
    if (
      registrationForm.values.phone &&
      !registrationForm.values.phone.startsWith("+38")
    ) {
      registrationForm.setFieldValue(
        "phone",
        `+38${registrationForm.values.phone}`
      );
    }
    if (registrationForm.values.phone.length === 2) {
      registrationForm.setFieldValue("phone", "");
    }
  }, [registrationForm.values.phone]);

  const handleCreateAccount = async () => {
    const errors = registrationForm.validate();
    if (!errors.hasErrors) {
      if (attempts < MAX_ATTEMPTS) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem(
          "inputRegistrationAttempts",
          newAttempts.toString()
        );
        localStorage.setItem(
          "inputRegistrationTime",
          new Date().getTime().toString()
        );
        setIsLoading(true);
        const address = "";
        const { firstName, lastName, email, phone, password, receiveUpdates } =
          registrationForm.values;
        const name = `${firstName} ${lastName}`;
        if (receiveUpdates === true) {
          await addNewReceiver(name, email, setInfoMessage);
        }
        const dateOfBirth = `${registrationForm.values.month}, ${registrationForm.values.date}`;
        const response = await registrateNewUser(
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth,
          password,
          address,
          setInfoMessage
        );
        setIsLoading(false);
        if (response === "created") {
          setIsFailed(false);
          setIsModalVisible(true);
          registrationForm.reset();
        } else if (response == "A user with this phone number already exists") {
          setRegistrationMessage(
            "Цей номер телефону вже існує. Спробуйте інший."
          );
          setIsFailed(true);
        } else if (
          response == "A user with this email address already exists"
        ) {
          setRegistrationMessage(
            "Ця електронна адреса вже існує. Спробуйте іншу."
          );
          setIsFailed(true);
        } else if (response == "User not activated") {
          setRegistrationMessage(
            "Ваш акаунт не активовано. Перевірте свою електронну пошту."
          );
          setIsFailed(true);
        } else {
          setIsFailed(true);
        }
      }
    }
  };

  return (
    <>
      {isLoading && <LoaderComponent />}
      {isModalVisible && (
        <ModalWindowComponent
          title="Майже готова"
          message="Будь ласка, перевірте вашу електронну скриньку для підтвердження реєстрації"
        />
      )}

      <div className="text-center mb-[48px]">
        <h2 className="text-[24px] md:text-[32px] lg:text-[48px] lg:mt-[20px] text-darkMaroon font-bold mb-[20px]">
          Вперше на Montre d`Art ?
        </h2>
        <p className="text-silver text-[14px] md:text-[16px]">
          Створити аккаунт
        </p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <Input
          inputType="input"
          placeholder="Ім'я"
          type="text"
          bordered={true}
          fullWidth={true}
          {...registrationForm.getInputProps("firstName")}
          errorType="critical"
          required={true}
        />

        <Input
          inputType="input"
          placeholder="Прізвище"
          type="text"
          bordered={true}
          fullWidth={true}
          {...registrationForm.getInputProps("lastName")}
          errorType="critical"
          required={true}
        />

        <p className="text-start text-silver mt-[6px]">Дата народження</p>
        <div className="flex flex-col lg:flex-row gap-[10px] text-left">
          <Input
            placeholder="Місяць"
            inputType="select"
            className="!w-full"
            bordered={true}
            options={months}
            value={month}
            scrollable={true}
            onSelect={(value) => {
              setMonth(value);
              registrationForm.setFieldValue("moth", value);
            }}
          />

          <Input
            placeholder="День"
            inputType="select"
            className="!w-full"
            bordered={true}
            options={dayOptions}
            value={day}
            scrollable={true}
            onSelect={(value) => {
              setDay(value);
              registrationForm.setFieldValue("date", value);
            }}
          />
        </div>
        <Input
          inputType="input"
          placeholder="Номер телефону"
          type="text"
          bordered={true}
          fullWidth={true}
          {...registrationForm.getInputProps("phone")}
          errorType="critical"
          required={true}
        />

        <div className="flex flex-col lg:flex-row gap-[10px]">
          <Input
            inputType="input"
            placeholder="Електронна пошта"
            type="email"
            fullWidth={true}
            className="lg:min-w-[314px]"
            bordered={true}
            {...registrationForm.getInputProps("email")}
            errorType="critical"
            required={true}
          />

          <Input
            inputType="input"
            placeholder="Підтвердіть електронну пошту"
            type="email"
            fullWidth={true}
            className="lg:min-w-[314px]"
            bordered={true}
            {...registrationForm.getInputProps("confirmEmail")}
            errorType="critical"
            required={true}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-[10px]">
          <Input
            inputType="password"
            placeholder="Пароль"
            type="password"
            visible={visible}
            onVisibilityChange={toggle}
            fullWidth={true}
            bordered={true}
            className="lg:min-w-[314px]"
            {...registrationForm.getInputProps("password")}
            errorType="critical"
            required={true}
          />

          <Input
            inputType="password"
            placeholder="Підтвердіть пароль"
            type="password"
            visible={visible}
            onVisibilityChange={toggle}
            bordered={true}
            fullWidth={true}
            className="lg:min-w-[314px]"
            {...registrationForm.getInputProps("confirmPassword")}
            errorType="critical"
            required={true}
          />
        </div>

        <div className="flex text-silver gap-[10px] mt-[10px] text-left">
          <input
            type="checkbox"
            id="sign-up-update"
            checked={registrationForm.values.receiveUpdates}
            onChange={(e) =>
              registrationForm.setFieldValue("receiveUpdates", e.target.checked)
            }
            className="w-[20px] h-[20px] appearance-none border-2 border-gray-400 rounded-sm cursor-pointer checked:bg-darkBurgundy checked:border-darkBurgundy checked:after:content-['✔'] checked:after:flex checked:after:justify-center checked:after:items-center checked:after:w-full checked:after:h-full checked:after:text-white focus:outline-none focus:ring-0"
          />
          <label htmlFor="sign-up-update" className="cursor-pointer">
            Отримувати найсвіжіші оновлення та акції
          </label>
        </div>

        <div>
          {isDisabled ? (
            <p className="mt-[16px] text-red-500">Ви вичерпали всі спроби!</p>
          ) : (
            isFailed &&
            attempts < MAX_ATTEMPTS && (
              <p className="mt-[16px]">
                Залишилось спроб: {MAX_ATTEMPTS - attempts}
              </p>
            )
          )}
        </div>

        <div className="mt-[16px]">
          <div>
            {registrationMessage && (
              <span
                className={`block text-center  text-[16px] text-darkBurgundy`}
              >
                {registrationMessage}
              </span>
            )}
          </div>

          <Button
            text="Створити аккаунт"
            type="button"
            className="!w-[208px] mx-auto mt-[8px] mb-[24px] lg:mb-[56px]"
            onClick={() => {
              handleCreateAccount();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            disabled={isDisabled}
          />
        </div>
      </div>
    </>
  );
};

export default RegistrationFormSection;
