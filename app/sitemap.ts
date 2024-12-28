import { Product } from "@/config/types";
import { getProducts } from "@/services/ProductService";

export default async function sitemap() {
  const fetchAllProducts = async (): Promise<Product[]> => {
    let allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor = "";

    while (hasNextPage) {
      const data = await getProducts(
        { productType: "", minPrice: 0, maxPrice: 0, searchText: "" },
        "",
        2,
        cursor,
        "BEST_SELLING",
        true,
        true
      );
      if (data.pageInfo.startCursor) {
        allProducts = [...allProducts, ...data.products];
        hasNextPage = data.pageInfo?.hasNextPage || false;
        cursor = data.pageInfo?.endCursor || "";
      } else {
        hasNextPage = false;
      }
    }

    return allProducts;
  };

  const products = await fetchAllProducts();
  const sitemapEntries = products.map((product: Product) => ({
    url: `https://wellness.markets/catalog/${product.handle}`,
    lastModified: new Date(),
  }));

  return [
    { url: "https://wellness.markets", lastModified: new Date() },
    { url: "https://wellness.markets/catalog", lastModified: new Date() },
    { url: "https://wellness.markets/legal", lastModified: new Date() },
    { url: "https://wellness.markets/contact-us", lastModified: new Date() },
    { url: "https://wellness.markets/auth", lastModified: new Date() },
    { url: "https://wellness.markets/", lastModified: new Date() },
    ...sitemapEntries,
  ];
}
