"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchProduct } from "@/api/api-call";

const LAPTOP_SLUGS = ["laptop", "laptops", "notebook", "notebooks", "computer", "computers"];
const PER_PAGE = 5;

export default function BestLaptops() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categorySlug, setCategorySlug] = useState("laptop");

  useEffect(() => {
    findAndFetch();
  }, []);

  useEffect(() => {
    if (categorySlug) fetchPage(page);
  }, [page, categorySlug]);

  const findAndFetch = async () => {
    setLoading(true);
    for (const slug of LAPTOP_SLUGS) {
      const res = await fetchProduct({ status: true, stock: true, category_slug: slug, limit: PER_PAGE, page: 1 });
      if (res?.product?.length > 0) {
        setCategorySlug(slug);
        setProducts(res.product);
        setImageBaseUrl(res.imageBaseUrl || "");
        setTotalPages(res.totalPages || 1);
        setLoading(false);
        return;
      }
    }
    const res = await fetchProduct({ status: true, stock: true, limit: PER_PAGE, page: 1 });
    if (res) {
      setProducts(res.product || []);
      setImageBaseUrl(res.imageBaseUrl || "");
      setTotalPages(res.totalPages || 1);
    }
    setLoading(false);
  };

  const fetchPage = async (p) => {
    setLoading(true);
    const res = await fetchProduct({ status: true, stock: true, category_slug: categorySlug, limit: PER_PAGE, page: p });
    if (res) {
      setProducts(res.product || []);
      setImageBaseUrl(res.imageBaseUrl || "");
      setTotalPages(res.totalPages || 1);
    }
    setLoading(false);
  };

  const fmt = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  const discPct = (o, f) => o > 0 ? Math.round(((o - f) / o) * 100) : 0;
  const imgSrc = (t) => t?.startsWith('http') ? t : (t ? `${imageBaseUrl}main/${t}` : "/image/Best-laptop.png");

  return (
    <section className="w-full rounded-3xl bg-white border border-[#E5E5E5] shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5">
        <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#111827]">BEST LAPTOPS &amp; COMPUTERS</h2>
        <button onClick={() => router.push(`/store?category=${categorySlug}&page=1`)} className="text-xs font-medium text-gray-500 hover:text-[#01A49E] transition">View All</button>
      </div>

      {/* Banner */}
      <div className="px-6 pt-4">
        <div className="relative h-40 overflow-hidden rounded-[20px] bg-[#111827] group cursor-pointer" onClick={() => router.push(`/store?category=${categorySlug}&page=1`)}>
          <Image src="/image/Laptop.png" alt="Laptops" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="relative z-10 flex h-full flex-col justify-center px-6 text-white">
            <h3 className="text-[18px] font-semibold leading-tight">BEST LAPTOPS<br />&amp; COMPUTERS</h3>
            <button className="mt-4 w-max rounded-full bg-black px-4 py-2 text-[11px] font-semibold text-white hover:bg-black/80 transition">SHOP NOW</button>
          </div>
        </div>
      </div>

      <div className="mt-5 h-px w-full bg-gray-100" />

      {/* Products */}
      <div className="grid gap-5 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {loading ? [...Array(PER_PAGE)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-gray-50 p-4 animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-40" />
            <div className="mt-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
          </div>
        )) : products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No laptop products found</div>
        ) : products.map((product) => (
          <article key={product._id} onClick={() => router.push(`/product/${product.slug}`)}
            className="flex h-full flex-col rounded-3xl bg-[#F8FAFC] p-4 transition hover:shadow-md cursor-pointer group">
            <div className="relative flex items-center justify-center rounded-[20px] bg-white py-4">
              <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-600 hover:bg-black/10 transition" onClick={(e) => e.stopPropagation()}>
                <FiHeart className="text-[15px]" />
              </button>
              {product.discount_price > 0 && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-[#00BFA5] px-3 py-1 text-[11px] font-semibold text-white">
                  SAVE {fmt(product.original_price - product.final_price)}
                </div>
              )}
              <img src={imgSrc(product.thumbnail)} alt={product.name} className="h-40 w-auto object-contain group-hover:scale-105 transition duration-300" onError={(e) => { e.target.src = "/image/Best-laptop.png"; }} />
            </div>
            <div className="mt-4 flex flex-1 flex-col">
              <h3 className="line-clamp-2 text-[13px] font-semibold text-[#111827] group-hover:text-teal-600 transition">{product.name}</h3>
              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="text-[16px] font-semibold text-[#01A49E]">{fmt(product.final_price)}</span>
                {product.discount_price > 0 && <>
                  <span className="text-[12px] text-gray-400 line-through">{fmt(product.original_price)}</span>
                  <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discPct(product.original_price, product.final_price)}% OFF</span>
                </>}
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-600">
                <span className={`h-1.5 w-1.5 rounded-full ${product.stock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{product.stock ? "In stock" : "Out of stock"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
