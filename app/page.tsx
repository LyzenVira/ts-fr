import SliderSection from "@/app/sections/home-page/WatchesSliderSection";
import OurMissionSection from "@/app/sections/home-page/OurMissionSection";
import NewsSection from "./sections/home-page/NewsSection";
import HeroSection from "./sections/home-page/HeroSection";
import AboutUsSection from "./sections/home-page/AboutUsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art - головна сторінка",
  description: "Дізнайтесь про нас більше",
  keywords: ["Годинники", "Чернівці", "онлайн-магазин"],
  authors: { name: "Montre d`Art" },
  icons: { icon: "@/app/favicon.ico" },
  openGraph: {
    title: "Montre d`Art - онлайн-магазин годинників",
    description: "Найкращі годинники за доступною ціною",
    url: "https://wellness.markets",
    siteName: "Montre d`Art",
    images: [
      {
        url: "",
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

export default function Home() {
  return (
    <>
      <HeroSection />
      <SliderSection />
      <OurMissionSection />
      <AboutUsSection />
      <NewsSection />
    </>
  );
}
