"use client";

import { useEffect, useState } from "react";
import { fetchProduct } from "@/api/api-call";
import ProductsGrid from "./ProductsGrid";

export default function ProductsWrapper({ user, searchParams }) {

  const [products, setProducts] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");

  const { brand_slug, color_slug, min_price, max_price, page, category } = searchParams;

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetchProduct({
        status: true,
        brand_slug,
        color_slug,
        min_price,
        max_price,
        page,
        category_slug: category
      });

      if (res) {
        setProducts(res.product || []);
        setImageBaseUrl(res.imageBaseUrl || "");
      }
    };

    loadProducts();
  }, [brand_slug, color_slug, min_price, max_price, page, category]);

  return (
    <ProductsGrid
      user={user}
      products={products}
      imageBaseUrl={imageBaseUrl}
    />
  );
}
