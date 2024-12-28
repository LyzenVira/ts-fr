import { Metadata } from "next";
import ForgotMeFormSection from "@/app/sections/authorization-page/ForgotMeFormSection";

export const metadata: Metadata = {
  title: "Montre d`Art  - Відновлення пароля",
  description: "Сторінка відновлення пароля",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
      <ForgotMeFormSection />
    </>
  );
};

export default Page;
