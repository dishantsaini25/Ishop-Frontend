"use client";

import { useEffect, useState } from "react";
import { FiImage, FiArrowLeft, FiSave } from "react-icons/fi";
import { axiosInstance, notify, createSlug } from "../../../../helper/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const response = await axiosInstance.put(`products/update/${product._id}`, form);
      notify(response.data.message, response.data.success);
      if (response.data.success) router.push("/admin/products");
    } catch (error) {
      console.log(error);
      notify("Update failed", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        <Link 
          href="/admin/products" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-4 text-sm"
        >
          <FiArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Edit Product
          </h1>

          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={handleNameChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Slug
              </label>
              <input
                value={slug}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Original Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Final Price
                </label>
                <input
                  type="number"
                  value={finalPrice}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff7b00] outline-none resize-y"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Colors
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {colors?.length > 0 ? (
                  colors.map((color) => (
                    <button
                      type="button"
                      key={color._id}
                      onClick={() => toggleColor(color._id)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition text-sm ${
                        selectedColors.includes(color._id)
                          ? "bg-[#ff7b00] text-white border-[#ff7b00]"
                          : "bg-white hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400">No colors available</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Thumbnail
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {product?.thumbnail && (
                  <img
                    src={`${imageBaseUrl}main/${product.thumbnail}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border"
                    alt="Current thumbnail"
                  />
                )}
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 flex-1 w-full">
                  <FiImage className="text-gray-400 text-lg shrink-0" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}