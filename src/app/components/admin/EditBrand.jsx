"use client";

import { useRef, useEffect, useState } from "react";
import Select from "react-select";
import { FiTag, FiLink, FiImage, FiArrowLeft, FiSave, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { createSlug, notify } from "../../../../helper/helper";
import Link from "next/link";

export default function EditBrand({ brand, imageBaseUrl }) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(imageBaseUrl + brand.image);
  const nameRef = useRef(null);
  const slugRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  /* ---------- FETCH CATEGORY ---------- */
  useEffect(() => {
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    fetch(`${backendUrl}/category?status=true`, { credentials: 'include' })
      .then(r => r.json())
      .then((res) => {
        if (res.success) {
          const options = res.data.category.map((cat) => ({
            value: cat._id,
            label: cat.name
          }));
          setCategories(options);
          if (brand.category_ids) {
            const selected = brand.category_ids.map((cat) => ({
              value: cat._id,
              label: cat.name
            }));
            setSelectedCategories(selected);
          }
        }
      })
      .catch(() => notify("Category Load Error", false));
  }, []);

  /* ---------- GENERATE SLUG ---------- */
  const generateSlug = () => {
    const slug = createSlug(nameRef.current.value);
    slugRef.current.value = slug;
  };

  /* ---------- IMAGE PREVIEW ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /* ---------- SUBMIT ---------- */
  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const form = new FormData();

    if (nameRef.current.value !== brand.name) {
      form.append("name", nameRef.current.value);
      form.append("slug", slugRef.current.value);
    }

    /* ---------- CATEGORY UPDATE ---------- */
    const categoryIds = selectedCategories.map((cat) => cat.value);
    form.append("category_ids", JSON.stringify(categoryIds));

    /* ---------- IMAGE ---------- */
    if (event.target.brandImage.files[0]) {
      form.append("image", event.target.brandImage.files[0]);
    }

    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    fetch(`${backendUrl}/brands/${brand._id}`, {
      method: 'PUT',
      credentials: 'include',
      body: form,
    })
      .then(r => r.json())
      .then((data) => {
        notify(data.message, data.success);
        if (data.success) router.push("/admin/brands");
      })
      .catch(() => notify("Internal Server Error", false))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/admin/brands" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <FiArrowLeft size={16} />
            Back to Brands
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Edit Brand
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Update brand information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            
            {/* Brand Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-[#ff7b00] focus-within:border-transparent transition">
                <FiTag className="text-gray-400 text-sm sm:text-base shrink-0" />
                <input
                  ref={nameRef}
                  defaultValue={brand.name}
                  onChange={generateSlug}
                  type="text"
                  className="w-full outline-none text-sm sm:text-base bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Slug
              </label>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50">
                <FiLink className="text-gray-400 text-sm sm:text-base shrink-0" />
                <input
                  ref={slugRef}
                  defaultValue={brand.slug}
                  readOnly
                  type="text"
                  className="w-full outline-none text-sm sm:text-base bg-transparent text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Slug is auto-generated from name</p>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Select Categories
              </label>
              <Select
                options={categories}
                value={selectedCategories}
                onChange={setSelectedCategories}
                isMulti
                placeholder="Select Categories..."
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "12px",
                    borderColor: "#e5e7eb",
                    padding: "2px 4px",
                    minHeight: "44px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#ff7b00" }
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 20
                  })
                }}
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Brand Image
              </label>
              <div className="space-y-3 sm:space-y-4">
                {/* Current Image Preview */}
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={previewImage} 
                    alt="Brand preview" 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Current Image</p>
                    <p className="text-xs text-gray-400 break-all">{brand.image}</p>
                  </div>
                  {previewImage !== (imageBaseUrl + brand.image) && (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(imageBaseUrl + brand.image)}
                      className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                
                {/* File Input */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-[#ff7b00]">
                  <FiImage className="text-gray-400 text-sm sm:text-base shrink-0 mt-1 sm:mt-0" />
                  <input
                    type="file"
                    accept="image/*"
                    name="brandImage"
                    onChange={handleImageChange}
                    className="w-full text-xs sm:text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 sm:file:px-4 file:py-1.5 sm:file:py-2 file:text-xs sm:file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100 transition"
                  />
                </div>
                <p className="text-xs text-gray-400">Recommended: Square image, 100x100px or larger</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#ff7b00] px-5 sm:px-6 py-2 text-white hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Update Brand
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}