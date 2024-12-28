import ActivatingSection from "@/app/sections/execution-sections/ActivatedSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art - Активація аккаунту",
  description: "Активація аккаунту",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = ({ params }: { params: any }) => {
  const activatedToken = params.activatedToken;
  return (
    <>
      <ActivatingSection activatedToken={activatedToken} />
    </>
  );
};

export default Page;
