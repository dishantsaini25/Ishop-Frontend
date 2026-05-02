"use client";

import { useRef, useState } from "react";
import Select from "react-select/base";
import { FiLink } from "react-icons/fi";
import { axiosInstance, createSlug, notify } from "../../../../helper/helper";
import { FiImage, FiArrowLeft, FiSave, FiPackage, FiTag, FiGrid, FiDroplet, FiFileText, FiDollarSign, FiPercent } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct({ category, brand, color }) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [SelColors, setSelColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const nameRef = useRef();
  const slugRef = useRef();
  const originalPriceRef = useRef();
  const discountRef = useRef();
  const finalPriceRef = useRef();
  const descriptionRef = useRef();
  const thumbnailRef = useRef();

  function colorIdsSet(data) {
    const colors = data.map(o => o.value);
    setSelColors(colors);
  }

  function generateSlug() {
    const slug = createSlug(nameRef.current.value);
    slugRef.current.value = slug;
  }

  function calculateDiscount() {
    let op = Number(originalPriceRef.current.value);
    let fp = Number(finalPriceRef.current.value);

    if (!op || !fp) return;

    if (fp > op) {
      notify("Final price should be less than original price", false);
      return;
    }

    const dp = ((op - fp) / op) * 100;
    discountRef.current.value = parseInt(dp);
  }

  function submitHandler(event) {
    event.preventDefault();

    const file = thumbnailRef.current.files[0];

    if (!file) {
      notify("Thumbnail required", false);
      return;
    }

    if (!selectedCategory || !selectedBrand) {
      notify("Category & Brand required", false);
      return;
    }

    setLoading(true);

    const form = new FormData();

    form.append("name", nameRef.current.value);
    form.append("slug", slugRef.current.value);
    form.append("description", descriptionRef.current.value);
    form.append("original_price", originalPriceRef.current.value);
    form.append("discount_price", discountRef.current.value);
    form.append("final_price", finalPriceRef.current.value);
    form.append("category_id", selectedCategory.value);
    form.append("brand_id", selectedBrand.value);
    form.append("color_ids", JSON.stringify(SelColors));
    form.append("thumbnail", file);

    axiosInstance.post("products/create", form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((response) => {
      notify(response.data.message, response.data.success);

      if (response.data.success) {
        router.push("/admin/products");
      }
    })
    .catch((error) => {
      console.log(error);
      notify("Internal Server Error", false);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-6 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/admin/products" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base"
          >
            <FiArrowLeft className="text-lg" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FiPackage className="text-2xl sm:text-3xl" />
              Add New Product
            </h2>
            <p className="text-orange-100 text-xs sm:text-sm mt-1">Fill in the product details below</p>
          </div>

          {/* Form Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiTag className="text-orange-500" />
                Product Name
              </label>
              <input
                ref={nameRef}
                onChange={generateSlug}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiLink className="text-orange-500" />
                Slug
              </label>
              <input
                ref={slugRef}
                readOnly
                placeholder="Auto-generated slug"
                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-gray-50 text-gray-600 text-sm sm:text-base"
              />
            </div>

            {/* Price Fields - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiDollarSign className="text-orange-500" />
                  Original Price
                </label>
                <input
                  type="number"
                  ref={originalPriceRef}
                  onChange={calculateDiscount}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiPercent className="text-orange-500" />
                  Discount (%)
                </label>
                <input
                  ref={discountRef}
                  readOnly
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-gray-50 text-gray-600 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiDollarSign className="text-green-500" />
                  Final Price
                </label>
                <input
                  type="number"
                  ref={finalPriceRef}
                  onChange={calculateDiscount}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="text-orange-500" />
                Description
              </label>
              <textarea
                ref={descriptionRef}
                placeholder="Enter product description"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-y text-sm sm:text-base"
              />
            </div>

            {/* Category & Brand - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiGrid className="text-orange-500" />
                  Category
                </label>
                <Select
                  options={category?.category?.map((c) => ({
                    value: c._id,
                    label: c.name
                  }))}
                  onChange={setSelectedCategory}
                  placeholder="Select Category"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#f97316',
                      primary25: '#fed7aa',
                    },
                  })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiPackage className="text-orange-500" />
                  Brand
                </label>
                <Select
                  options={brand?.brand?.map((b) => ({
                    value: b._id,
                    label: b.name
                  }))}
                  onChange={setSelectedBrand}
                  placeholder="Select Brand"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#f97316',
                      primary25: '#fed7aa',
                    },
                  })}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiDroplet className="text-orange-500" />
                Colors (Multi-select)
              </label>
              <Select
                isMulti
                options={color?.colors?.map((col) => ({
                  value: col._id,
                  label: col.name
                }))}
                onChange={colorIdsSet}
                placeholder="Select Colors"
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#f97316',
                    primary25: '#fed7aa',
                  },
                })}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiImage className="text-orange-500" />
                Product Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-500 transition-colors duration-200">
                <input
                  type="file"
                  ref={thumbnailRef}
                  accept="image/*"
                  required
                  className="w-full text-sm sm:text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-colors duration-200 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
              >
                <FiSave className="text-lg sm:text-xl" />
                {loading ? "Saving Product..." : "Save Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}