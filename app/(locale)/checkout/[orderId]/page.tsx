import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Успішне замовлення",
  description: "Швидке оформлення замовлення",
  icons: { icon: "@/app/favicon.ico" },
  other: { "Cache-Control": "no-store" },
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
	 <h1>Дякуємо за ваше замовлення</h1>
    </>
  );
};

export default Page;
