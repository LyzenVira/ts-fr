"use client";
import React, { useState, createContext, useEffect } from "react";

import { CardProps } from "@/config/types";
import CategorySection from "./CategorySection";
import { useAlert } from "@/hooks/alertContext";
import { getFilters } from "@/services/ProductService";
import CategoryAsideFilters from "./CategoryAsideFilters";
import TitleComponents from "@/components/TitleComponents";
import { PaginationProvider } from "@/hooks/useCustomPagination";


export const ProductsContext = createContext<CardProps[]>([]);
const LIMIT = 12;

const CategoryMain = () => {
  const [filters, setFilters] = useState({});
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [products, setProducts] = useState<CardProps[]>([]);
  const [isStart, setIsStart] = useState<boolean>(true);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("RELEVANCE");
  const [reverse, setReverse] = useState<boolean>(true);
 const { setInfoMessage } = useAlert();

  useEffect(() => {
    const fetchFilters = async () => {
      const data = await getFilters(setInfoMessage);
      if (data.priceRange.value[1] != 10) {
        setFilters(data);
        setIsFilter(true);
      }
    };

    fetchFilters();
  }, []);

  const handleChangeTotalProducts = (num: number) => {
    setTotalProducts(num);
  };

  const handleUpdateProducts = (newProducts: CardProps[]) => {
    setProducts(newProducts);
  };

  return (
    <>
      <PaginationProvider>
        <ProductsContext.Provider value={products}>
          <TitleComponents
            text="Продукти"
            additionalText={`${totalProducts} Кількість продуктів`}
          />
          <div className="xl:flex xl:px-[75px]">
            <CategoryAsideFilters
              isFilter={isFilter}
              handleUpdateProducts={handleUpdateProducts}
              handleChangeTotalProducts={handleChangeTotalProducts}
              limit={LIMIT}
              filtersData={filters}
              sort={sort}
              setSort={setSort}
              reverse={reverse}
              setReverse={setReverse}
              setIsStart={setIsStart}
            />
            <CategorySection
              isStart={isStart}
              totalProducts={totalProducts}
              limit={LIMIT}
              setSort={setSort}
              setReverse={setReverse}
              reverse={reverse}
              sort={sort}
            />
          </div>
        </ProductsContext.Provider>
      </PaginationProvider>
    </>
  );
};

export default CategoryMain;
