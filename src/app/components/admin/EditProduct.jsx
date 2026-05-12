"use client";

import { useEffect, useState } from "react";
import { FiImage, FiArrowLeft, FiSave, FiTag } from "react-icons/fi";
import { notify, createSlug } from "../../../../helper/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export default function EditProduct({ product, imageBaseUrl, colors }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Deal of the day
  const [isDeal, setIsDeal] = useState(false);
  const [dealEndTime, setDealEndTime] = useState("");
  const [dealDiscount, setDealDiscount] = useState(0);
  const [dealStock, setDealStock] = useState(0);
  const [dealLoading, setDealLoading] = useState(false);

  useEffect(() => {
    if (!product) return;
    setName(product.name ?? "");
    setSlug(product.slug ?? "");
    setOriginalPrice(product.original_price ?? "");
    setDiscountPrice(product.discount_price ?? "");
    setDescription(product.description ?? "");
    if (product.color_ids?.length) {
      setSelectedColors(product.color_ids.map((c) => c._id));
    }
    // Deal fields
    const deal = product.deal_of_day;
    if (deal) {
      setIsDeal(deal.is_deal ?? false);
      setDealDiscount(deal.deal_discount_percent ?? 0);
      setDealStock(deal.total_stock_for_deal ?? 0);
      if (deal.deal_end_time) {
        // Format for datetime-local input
        const d = new Date(deal.deal_end_time);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDealEndTime(local);
      }
    }
  }, [product]);

  useEffect(() => {
    const original = Number(originalPrice);
    const discount = Number(discountPrice);
    if (!isNaN(original) && !isNaN(discount)) {
      setFinalPrice(original - discount);
    }
  }, [originalPrice, discountPrice]);

  function handleNameChange(e) {
    const value = e.target.value;
    setName(value);
    setSlug(createSlug(value));
  }

  function toggleColor(id) {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function submitHandler(e) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("name", name);
    form.append("slug", slug);
    form.append("original_price", originalPrice);
    form.append("discount_price", discountPrice);
    form.append("final_price", finalPrice);
    form.append("description", description);
    form.append("color_ids", JSON.stringify(selectedColors));
    if (thumbnail) form.append("thumbnail", thumbnail);
    try {
      const res = await fetch(`${backendUrl()}/products/update/${product._id}`, {
        method: "PUT",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      notify(data.message, data.success);
      if (data.success) router.push("/admin/products");
    } catch {
      notify("Update failed", false);
    } finally {
      setLoading(false);
    }
  }

  async function saveDeal(e) {
    e.preventDefault();
    setDealLoading(true);
    try {
      const res = await fetch(`${backendUrl()}/products/deal-of-day/${product._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_deal: isDeal,
          deal_end_time: dealEndTime ? new Date(dealEndTime).toISOString() : null,
          deal_discount_percent: Number(dealDiscount),
          total_stock_for_deal: Number(dealStock),
        }),
      });
      const data = await res.json();
      notify(data.message, data.success);
    } catch {
      notify("Deal update failed", false);
    } finally {
      setDealLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition text-sm">
          <FiArrowLeft size={16} /> Back to Products
        </Link>

        {/* ── Product Info ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Product Name <span className="text-red-500">*</span></label>
              <input value={name} onChange={handleNameChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none transition" required />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Slug</label>
              <input value={slug} readOnly className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Original Price <span className="text-red-500">*</span></label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Discount Amount</label>
                <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Final Price</label>
                <input type="number" value={finalPrice} readOnly className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none resize-y" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">Colors</label>
              <div className="flex flex-wrap gap-2">
                {colors?.length > 0 ? colors.map((color) => (
                  <button type="button" key={color._id} onClick={() => toggleColor(color._id)}
                    className={`px-4 py-1.5 rounded-full border transition text-sm ${selectedColors.includes(color._id) ? "bg-[#ff7b00] text-white border-[#ff7b00]" : "bg-white hover:bg-gray-100 border-gray-300"}`}>
                    {color.name}
                  </button>
                )) : <p className="text-gray-400 text-sm">No colors available</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Thumbnail</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {product?.thumbnail && (
                  <img src={`${imageBaseUrl}main/${product.thumbnail}`} className="w-20 h-20 object-cover rounded-xl border" alt="Current" />
                )}
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 flex-1 w-full">
                  <FiImage className="text-gray-400 shrink-0" />
                  <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100" />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm">Cancel</button>
              <button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating...</> : <><FiSave size={16} />Update Product</>}
              </button>
            </div>
          </form>
        </div>

        {/* ── Deal of the Day ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border-l-4 border-[#01A49E]">
          <div className="flex items-center gap-2 mb-6">
            <FiTag className="text-[#01A49E] text-xl" />
            <h2 className="text-lg font-bold text-gray-800">Deal of the Day Settings</h2>
          </div>

          <form onSubmit={saveDeal} className="space-y-5">
            {/* Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">Enable Deal of the Day</p>
                <p className="text-sm text-gray-500">Show this product as today's deal on homepage</p>
              </div>
              <button type="button" onClick={() => setIsDeal(!isDeal)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isDeal ? "bg-[#01A49E]" : "bg-gray-300"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isDeal ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {isDeal && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Deal Ends At <span className="text-red-500">*</span></label>
                  <input type="datetime-local" value={dealEndTime} onChange={(e) => setDealEndTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#01A49E] outline-none text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Extra Discount (%)</label>
                  <input type="number" min="0" max="100" value={dealDiscount} onChange={(e) => setDealDiscount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#01A49E] outline-none" />
                  <p className="text-xs text-gray-400 mt-1">Additional % off on deal price</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Total Deal Stock</label>
                  <input type="number" min="0" value={dealStock} onChange={(e) => setDealStock(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#01A49E] outline-none" />
                  <p className="text-xs text-gray-400 mt-1">Units available for this deal</p>
                </div>
              </div>
            )}

            {/* Preview */}
            {isDeal && dealDiscount > 0 && (
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                <p className="text-sm font-medium text-teal-800">Deal Preview</p>
                <p className="text-sm text-teal-700 mt-1">
                  Original: ₹{product?.original_price} →
                  Deal Price: ₹{Math.round(product?.final_price * (1 - dealDiscount / 100))}
                  <span className="ml-2 font-semibold">({dealDiscount}% extra off)</span>
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={dealLoading}
                className="flex items-center gap-2 bg-[#01A49E] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm font-medium">
                {dealLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><FiSave size={16} />Save Deal Settings</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
