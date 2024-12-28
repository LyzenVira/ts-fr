import AccountSection from "@/app/sections/account-page/AccountSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Ваш акаунт",
  description: "Акаунт користувача",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
      <AccountSection />
    </>
  );
};

export default Page;
