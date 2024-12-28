import ResetPasswordFormSection from "@/app/sections/authorization-page/ResetPasswordFormSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Відновлення паролю",
  description: "Відновлення паролю",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = ({ params }: { params: any }) => {
	const resetPasswordToken = params.resetToken;
  return (
    <>
    <ResetPasswordFormSection resetPasswordToken={resetPasswordToken}/>
    </>
  );
};

export default Page;