import Checkout from "@/app/sections/checkout-page/CheckoutSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Оформлення замовлення",
  description: "Швидке оформлення замовлення",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
      <Checkout />
    </>
  );
};

export default Page;
