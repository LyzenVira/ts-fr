import Auth from "@/app/sections/authorization-page/AuthorizationSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Авторизація",
  description: "Сторінка авторизації і реєстрації",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
      <Auth />
    </>
  );
};

export default Page;
