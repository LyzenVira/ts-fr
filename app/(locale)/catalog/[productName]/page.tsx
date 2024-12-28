import ProductSection from "@/app/sections/product-page/ProductSection";

// export const generateViewport = () => ({
// 	initialScale: 1.0,
// 	width: "device-width",
//  });

const Page = ({ params }: { params: any }) => {
  const productName = params.productName;

  return (
    <>
      <ProductSection productName={productName} />
    </>
  );
};

export default Page;
