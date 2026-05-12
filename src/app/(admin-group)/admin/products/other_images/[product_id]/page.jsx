'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddMultipleImages from "@/app/components/admin/AddMultipleImages";

export default function Page() {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product_id) return;
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    fetch(`${backendUrl}/products?id=${product_id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.product?.length > 0) {
          setProduct(data.data.product[0]);
          setImageBaseUrl(data.data.imageBaseUrl || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [product_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7b00]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <AddMultipleImages
      id={product_id}
      other_images={product.other_images || []}
      imageBaseUrl={imageBaseUrl}
    />
  );
}
