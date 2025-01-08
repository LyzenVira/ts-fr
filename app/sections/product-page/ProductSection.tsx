"use client";
import Image from "next/image";
import { Metadata } from "next";
import "@mantine/carousel/styles.css";
import { Loader } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import React, { FC, useEffect, useState } from "react";

import { Product } from "@/config/types";
import { useCart } from "@/hooks/useCart";
import { useAlert } from "@/hooks/alertContext";
import Button from "@/components/ButtonComponent";
import TitleComponents from "@/components/TitleComponents";
import { getProductByHandle } from "@/services/ProductService";

import LeftArrow from "@/images/product-page/arrow-left.svg";
import RightArrow from "@/images/product-page/arrow-right.svg";

export const metadata: Metadata = {
  title: "Montre d`Art - продукт",
  description: "Пропонуємо найбільший вибір годиннників",
  keywords: [
    "Годинники",
    "Чернівці",
    "онлайн-магазин",
    "продукт",
    "онлайн шопінг",
  ],
  icons: { icon: "@/app/favicon.ico" },
  openGraph: {
    title: "Montre d`Art - продукт",
    description: "Ознайомтесь з широким асортиментом годинників",
    url: "https://wellness.markets/catalog",
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

interface productProps {
  productName: string;
}

const ProductSection: FC<productProps> = ({ productName }) => {
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);
  const [maxQuantity, setMaxQuantity] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setInfoMessage } = useAlert();
  const { addToCart, isOpen, changeOpenState } = useCart();

  const slides = product?.images?.slice(1).map((item, index) => (
    <Carousel.Slide key={index}>
      <Image
        src={item}
        width={350}
        height={365}
        alt={`Image${index + 1}`}
        loading="lazy"
        className="w-[100%] h-[100%] object-cover"
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
        const productData: Product = await getProductByHandle(
          productName,
          setInfoMessage
        );
        console.log("d", productData);
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
      url: `https://wellness.markets/product/${product?.handle}`,
    },
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <TitleComponents
        text="продукт"
        additionalText="Продукт номер один за якістю"
      />

      <div className="flex flex-row items-start mx-[20px] lg:mx-[60px] mt-[30px]">
        <Button
          bordered
          className="flex !items-start text-[12px] py-[8px] px-[9px]"
          text="Повернутись до каталогу"
          href="/catalog"
          icon="back"
          background="transparent"
          tag="a"
        />
      </div>

      <div className="container flex flex-col md:flex-row gap-[100px] justify-items-center py-[30px] xl:py-[65px]">
        <div className="hidden xl:block xl:flex xl:flex-wrap xl:flex-row xl:gap-[30px]">
          {product?.images?.slice(1).map((item, index) => (
            <Image
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

        <div className="flex flex-col items-center text-center font-poppins">
          <h2 className="text-[36px]">{product?.title}</h2>

          <div className="flex mt-[15px] items-center">
            {product && product?.discount > 0 ? (
              <>
                <span className="text-[16px] ml-[8px] text-[grey] mt-[5px] line-through">
                ₴{Number(
                    Number(product?.price) / (1 - product?.discount / 100)
                  ).toFixed(2)}
                  
                </span>

                <span className="text-[24px] ml-[8px] mr-[10px] font-semibold">
                ₴{product?.price}
                </span>

                {product?.discount !== 0 && (
                  <div className="bg-[red] text-white rounded-lg px-2 top-2 left-2 font-semibold h-fit">
                    - {product?.discount}%
                  </div>
                )}
              </>
            ) : (
              <span className="text-[24px] font-semibold">
                ₴{product?.price}
              </span>
            )}
          </div>

          <p className="text-[14px] my-[20px] w-[350px] md:w-[400px] text-silver">
            {higherDescription ||
              "Цей годинник — ідеальне поєднання елегантності та функціональності. Високоякісні матеріали, стильний дизайн і точний механізм створюють неперевершене враження. Ідеальний аксесуар для будь-якого випадку"}
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

          <div className="flex my-[25px] items-center space-x-[40px]">
            <div className="flex items-center border-2 rounded-md overflow-hidden">
              <button
                onClick={handleDecrement}
                className={`w-[50px] h-[40px] border-r ${
                  quantity > 1 || isOutOfStock
                    ? "hover:bg-white bg-gray-200"
                    : "bg-white"
                }`}>
                -
              </button>
              <span className="w-[50px] h-[40px] flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className={`w-[50px] h-[40px] border-l ${
                  quantity < maxQuantity || isOutOfStock
                    ? "hover:bg-white bg-gray-200"
                    : "bg-white"
                }`}>
                +
              </button>
              {isOutOfStock && (
                <p className="text-darkBurgundy">Товару немає в наявності!</p>
              )}
            </div>

            <Button
              text="Place an order"
              className="mini:w-[80%] w-[100%] px-[50px]"
              onClick={() => handleAddToBasket(product?.id || "")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductSection;

{
  /* 
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "TimeStone",
            "item": "https://www.google.com.ua/?hl=uk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Годинники",
            "item": "https://www.google.com.ua/?hl=uk"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Molumenzeit S 2",
            "item": "https://www.google.com.ua/?hl=uk"
          }
        ]
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "11"
        },
        "name": "Molumenzeit S 2",
        "image": "https://cdn.shopify.com/s/files/1/0897/4191/8494/files/bluewatch.jpg?v=1729085317",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
        "brand": "ferferf",
        "offers": {
          "priceCurrency": "UAH",
          "price": "10000.00",
          "priceValidUntil": "2025-05-05",
          "availability": "https://schema.org/InStock",
          "url": "https://timestone.com/product/Molumenzeit S 2",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "70.00",
              "currency": "UAH"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "name": "Ukraine",
              "addressCountry": "UA"
            },
            "applicableCountry": {
              "@type": "Country",
              "name": "Ukraine",
              "addressCountry": "UA"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 2,
                "unitText": "BusinessDay",
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 5,
                "unitText": "BusinessDay",
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "name": "30-Day Return Policy",
            "url": "https://example.com/return-policy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "applicableCountry": {
              "@type": "Country",
              "name": "UA"
            },
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",
            "itemCondition": "https://schema.org/NewCondition",
            "merchantReturnDays": 30
          }
        }
      }
    </script>
  */
}
