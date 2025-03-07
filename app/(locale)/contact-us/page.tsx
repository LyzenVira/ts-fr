import ContactUsSection from "@/app/sections/contact-us/ContacUsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - зворотній зв'язок",
  description: "Зв'яжіться з нами, щоб дізнатися більше про годинники",
  keywords: [
    "контакти",
    "зворотній зв'язок",
    "годинники",
    "Чернівці",
    "онлайн-магазин",
  ],
  icons: { icon: "@/app/favicon.ico" },
  openGraph: {
    title: "Montre d`Art - зворотній зв'язок",
    description: "Зв'яжіться з нами, щоб дізнатися більше про годинники",
    url: "https://wellness.markets/contact-us",
    images: [
      {
        url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.uhdpaper.com%2F&psig=AOvVaw3uIc62Gm4xGzV2NFGYLUWR&ust=1733325924157000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLC687H0i4oDFQAAAAAdAAAAABAE",
        width: 800,
        height: 600,
      },
    ],
    locale: "ua",
    type: "website",
  },
};

export const generateViewport = () => ({
  initialScale: 1.0,
  width: "device-width",
});

const Page = () => {
  return (
    <>
      <ContactUsSection />
    </>
  );
};

export default Page;
