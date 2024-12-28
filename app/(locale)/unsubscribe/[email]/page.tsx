import UnsubscribeSection from "@/app/sections/execution-sections/UnsubscribeSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Відписка від розсилки",
  description: "Відписка",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const UnsubscribePage = ({ params }: { params: any }) => {
  const email = params.email || "";
  return <UnsubscribeSection email={email} />;
};

export default UnsubscribePage;