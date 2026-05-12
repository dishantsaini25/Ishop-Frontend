'use client';

import { useEffect, useState } from "react";
import AddProduct from "@/app/components/admin/AddProduct";

export default function Page() {
  const [data, setData] = useState({ category: null, brand: null, color: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    Promise.all([
      fetch(`${backendUrl}/category`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
      fetch(`${backendUrl}/brands`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
      fetch(`${backendUrl}/colors`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
    ]).then(([catData, brandData, colorData]) => {
      setData({
        category: catData?.success ? { category: catData.data?.category || [] } : { category: [] },
        brand: brandData?.success ? { brand: brandData.data?.brand || [] } : { brand: [] },
        color: colorData?.success ? { colors: colorData.data?.colors || [] } : { colors: [] },
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <AddProduct category={data.category} brand={data.brand} color={data.color} />;
}
