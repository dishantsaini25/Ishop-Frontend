"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBrand } from "@/api/api-call";
import BrandList from "./BrandList";

export default function ByBrand() {

  const { category_slug } = useParams();

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrand({ status: true, category_slug: category_slug })
      .then((res) => {
        // Only show brands that have at least 1 product
        const filtered = (res?.brand || []).filter(b => (b.productCount || 0) > 0);
        setBrands(filtered);
      });
  }, [category_slug]);

  return <BrandList brands={brands} />;
}
