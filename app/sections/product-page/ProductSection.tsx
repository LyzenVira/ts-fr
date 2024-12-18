"use client";
import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ButtonComponent";
import TitleComponents from "@/components/TitleComponents";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { Loader } from "@mantine/core";
import { getProductByHandle } from "@/services/ProductService";
import { Product } from "@/config/types";
import { useCart } from "@/hooks/useCart";
import "@mantine/carousel/styles.css";
import { Metadata } from "next";

import LeftArrow from "@/images/product-page/arrow-left.svg";
import RightArrow from "@/images/product-page/arrow-right.svg";

export const metadata: Metadata = {
  title: "Timestone - продукт",
  description: "Пропонуємо найбільший вибір годиннників",
  keywords: [
    "Годинники",
    "Чернівці",
    "онлайн-магазин",
    "продукт",
    "онлайн шопінг",
  ],
  icons: { icon: "@/app/favicon.ico" },
  viewport: { initialScale: 1.0, width: "device-width" },
  openGraph: {
    title: "Timestone - продукт",
    description: "Ознайомтесь з широким асортиментом годинників",
    url: "https://timestone.com/catalog",
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

interface productProps {
  productName: string;
}

const ProductSection: FC<productProps> = ({ productName }) => {
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);
  const [maxQuantity, setMaxQuantity] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const slides = product?.images?.slice(1).map((item, index) => (
    <Carousel.Slide key={index}>
      <Image
        src={item}
        width={350}
        height={365}
        alt={`Image${index + 1}`}
        loading="lazy"
      />
    </Carousel.Slide>
  ));

  const handleQuantityChange = (value: number | string | undefined) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (!isNaN(numericValue as number)) {
      setQuantity(numericValue as number);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(quantity + 1, maxQuantity);
    handleQuantityChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(quantity - 1, 1);
    handleQuantityChange(newValue);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await getProductByHandle(productName);
        if (productData) {
          setProduct(productData);
          setQuantity(productData.quantity && productData.quantity > 0 ? 1 : 0);
          setIsOutOfStock(productData.quantity === 0);
          setMaxQuantity(productData.quantity || 0);

          setIsLoading(true);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };
    fetchProduct();
  }, [productName]);

  if (!isLoading) {
    return (
      <div className="container flex justify-center">
        <Loader className="animate-spin rounded-full border-4 border-darkBurgundy border-b-transparent w-10 h-10" />
      </div>
    );
  }

  let higherDescription = "";
  let lowerDescription: any[] = [];

  if (product?.description) {
    const description = product?.description.split("&") || ["", ""];
    if (description.length > 1) {
      higherDescription = description[0] || "";
      lowerDescription = description[1].split(";").map((item) => {
        const [key, value] = item.split(":").map((part) => part.trim());
        return { key, value };
      });
    }
  }

  const { addToCart, isOpen, changeOpenState } = useCart();

  const handleAddToBasket = (id: string) => {
    !isOpen && changeOpenState(true);

    if (product) {
      addToCart(
        {
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: +product.price,
          image: product.images[0],
          quantity: quantity,
          maxQuantity: maxQuantity,
          caseColor: "red",
          strapColor: "red",
        },
        quantity
      );
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.title,
    image: product?.images[0],
    description: product?.description,
    brand: product?.vendor,
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product?.price,
      availability: product?.quantity,
      url: `https://timestone.com/product/${product?.handle}`,
    },
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <TitleComponents
        text="product"
        additionalText="Product / Product Number One"
      />

      <div className="flex flex-row items-start mx-[20px] lg:mx-[60px] mt-[30px]">
        <Button
          bordered
          className="flex !items-start text-[12px] py-[8px] px-[9px]"
          text="Back to catalog"
          href="/catalog"
          icon="back"
          background="transparent"
          tag="a"
        />
      </div>

      <div className="container flex flex-col md:flex-row gap-[100px] justify-items-center py-[30px] xl:py-[65px]">
        <div className="hidden xl:block xl:flex xl:flex-wrap xl:flex-row xl:gap-[30px]">
          {product?.images?.slice(1).map((item, index) => (
            <img
              key={index}
              src={item}
              width={350}
              height={365}
              alt={`Image${index + 1}`}
              loading="lazy"
            />
          ))}
        </div>

        <div className="w-[350px] mx-auto xl:hidden">
          <Carousel
            slideSize={100}
            height={200}
            slideGap="xl"
            loop
            dragFree
            previousControlIcon={
              <Image
                src={LeftArrow}
                alt="LeftArrow"
                width={80}
                className="my-[30px] ml-[50px] md:ml-[20px]"
              />
            }
            nextControlIcon={
              <Image
                src={RightArrow}
                alt="RightArrow"
                width={80}
                className="my-[30px] mr-[50px] md:mr-[20px]"
              />
            }>
            {slides}
          </Carousel>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-[32px]">{product?.title}</h2>
          <p className="text-[14px] my-[20px] w-[350px] md:w-[400px] text-silver">
            {higherDescription ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non."}
          </p>

          <hr className="block w-[350px] md:w-[400px]" />

          <div className="my-[15px] w-[350px] md:w-[400px] text-silver text-[14px] text-center space-y-[10px]">
            {lowerDescription.length != 0 ? (
              lowerDescription.map((property, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span>{property.key}</span>
                  <span>{property.value}</span>
                </div>
              ))
            ) : (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-wrap justify-evenly ">
                    <span>{`——`}</span>
                    <span>{`——`}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <hr className="block w-[400px]" />

          <div className="flex my-[25px] space-x-[40px]">
            <div className="flex items-center border-2 rounded-md w-fit overflow-hidden">
              <button
                onClick={handleDecrement}
                className={`w-11 h-12 rounded-sm border-r-2 ${
                  quantity > 1 || isOutOfStock
                    ? "hover:bg-white bg-gray-200"
                    : "bg-white"
                }`}>
                -
              </button>
              <span className="w-10 h-10 rounded-sm flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className={`w-11 h-12 rounded-sm border-l-2 ${
                  quantity < maxQuantity || isOutOfStock
                    ? "hover:bg-white bg-gray-200"
                    : "bg-white"
                }`}>
                +
              </button>
              {isOutOfStock && (
                <p className="text-darkBurgundy">Product is out of stock!</p>
              )}
            </div>

            <span className="text-[20px] px-[10px] py-[10px]">
              {product?.price}$
            </span>
          </div>

          <Button
            text="Place an order"
            className="mini:w-[80%] w-[100%] px-[50px] mb-[10px]"
            onClick={() => handleAddToBasket(product?.id || "")}
          />
        </div>
      </div>
    </section>
  );
};
export default ProductSection;
