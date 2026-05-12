"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProduct } from "@/api/api-call";
import ProductCard from "./ProductCard";
import { FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const PER_PAGE = 12;

export default function ProductsWrapper({ user, searchParams }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [products, setProducts] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Read from URL
  const category = sp.get("category") || searchParams?.category || "";
  const brand = sp.get("brand") || searchParams?.brand_slug || "";
  const color = sp.get("color") || searchParams?.color_slug || "";
  const minPrice = sp.get("min_price") || searchParams?.min_price || "";
  const maxPrice = sp.get("max_price") || searchParams?.max_price || "";
  const currentPage = parseInt(sp.get("page") || searchParams?.page || "1");
  const sort = sp.get("sort") || "";
  const search = sp.get("search") || "";

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetchProduct({
      status: true,
      category_slug: category || undefined,
      brand_slug: brand || undefined,
      color_slug: color || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      page: currentPage,
      sort: sort === "newest" ? "-createdAt" : sort || undefined,
      search: search || undefined,
      limit: PER_PAGE,
    });

    if (res) {
      setProducts(res.product || []);
      setImageBaseUrl(res.imageBaseUrl || "");
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    }
    setLoading(false);
  }, [category, brand, color, minPrice, maxPrice, currentPage, sort, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateUrl = (params) => {
    const current = new URLSearchParams(sp.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) current.set(k, v);
      else current.delete(k);
    });
    router.push(`/store?${current.toString()}`);
  };

  const goToPage = (p) => updateUrl({ page: p });
  const changeSort = (s) => updateUrl({ sort: s, page: 1 });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-6">

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Loading..." : `${total} products found`}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <FiFilter size={14} className="text-gray-500" />
              <select
                value={sort}
                onChange={(e) => changeSort(e.target.value)}
                className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Products Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            <button onClick={() => router.push('/store')} className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} imageBaseUrl={imageBaseUrl} user={user} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <FiChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p;
                if (totalPages <= 7) {
                  p = i + 1;
                } else if (currentPage <= 4) {
                  p = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  p = totalPages - 6 + i;
                } else {
                  p = currentPage - 3 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                      p === currentPage
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next <FiChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Page info */}
        {!loading && totalPages > 1 && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Page {currentPage} of {totalPages} · {total} total products
          </p>
        )}
      </div>
    </div>
  );
}
