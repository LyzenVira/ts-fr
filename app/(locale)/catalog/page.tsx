import CategoryMain from "@/app/sections/category-page/CategoryMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art - каталог",
  description: "Пропонуємо найбільший вибір годиннників",
  keywords: [
    "Годинники",
    "Чернівці",
    "онлайн-магазин",
    "каталог",
    "пошук",
    "фільтрація",
    "онлайн шопінг",
  ],
  openGraph: {
    title: "Montre d`Art - каталог",
    description: "Ознайомтесь з широким асортиментом годинників",
    url: "https://wellness.markets/catalog",
    images: [
      {
        url: "",
        width: 800,
        height: 600,
      },
    ],
  },
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

export default function CategoryPage() {
  return (
    <>
      <CategoryMain />
    </>
  );
}
