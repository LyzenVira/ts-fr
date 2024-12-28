import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Успішне замовлення",
  description: "Швидке оформлення замовлення",
  icons: { icon: "@/app/favicon.ico" },
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
	 <p>LOX</p>
    </>
  );
};

export default Page;
