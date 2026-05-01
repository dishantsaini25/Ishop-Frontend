"use client";

import { useRef, useEffect, useState } from "react";
import Select from "react-select";
import { FiArrowLeft, FiX, FiSave, FiUpload, FiTag, FiLink, FiFolder, FiImage } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { axiosInstance, createSlug, notify } from "../../../../../../helper/helper";
import Link from "next/link";

export default function AddBrandPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const nameRef = useRef(null);
  const slugRef = useRef(null);
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  /* ---------- FETCH CATEGORY ---------- */
  useEffect(() => {
    axiosInstance.get("category?status=true")
      .then((res) => {
        if (res.data.success) {
          const categoryOptions = res.data.data.category.map((cat) => ({
            value: cat._id,
            label: cat.name
          }));
          setCategories(categoryOptions);
        }
      })
      .catch(() => {
        notify("Category Load Error", false);
      });
  }, []);

  /* ---------- GENERATE SLUG ---------- */
  const generateSlug = () => {
    const slug = createSlug(nameRef.current.value);
    slugRef.current.value = slug;
  };

  /* ---------- IMAGE PREVIEW ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ---------- REMOVE IMAGE ---------- */
  const removeImage = () => {
    setPreviewImage(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* ---------- SUBMIT ---------- */
  const submitHandler = (event) => {
    event.preventDefault();

    const file = fileRef.current.files[0];

    if (!file) {
      notify("Image is required", false);
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("name", nameRef.current.value);
    form.append("slug", slugRef.current.value);
    form.append("image", file);

    const categoryIds = selectedCategories.map((cat) => cat.value);
    form.append("category_ids", JSON.stringify(categoryIds));

    axiosInstance.post("brands/create", form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((response) => {
      notify(response.data.message, response.data.success);

      if (response.data.success) {
        router.push("/admin/brands");
      }
    })
    .catch((error) => {
      console.log(error);
      notify("Internal Server Error", false);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Custom styles for React Select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? '#f97316' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
      '&:hover': {
        borderColor: '#f97316'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#fed7aa'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#9a3412'
    }),
    multiValueRemove: (base) => ({
      ...base,
      '&:hover': {
        backgroundColor: '#f97316',
        color: 'white'
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-6 sm:px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/admin/brands" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base"
          >
            <FiArrowLeft className="text-lg" />
            <span>Back to Brands</span>
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FiTag className="text-2xl sm:text-3xl" />
              Add New Brand
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mt-1">Fill in the brand details below</p>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Brand Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiTag className="text-orange-500" />
                Brand Name
              </label>
              <input
                ref={nameRef}
                onChange={generateSlug}
                placeholder="Enter brand name"
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

            {/* Categories */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFolder className="text-orange-500" />
                Categories (Multi-select)
              </label>
              <Select
                options={categories}
                isMulti
                value={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select categories for this brand"
                styles={selectStyles}
                className="text-sm"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiImage className="text-orange-500" />
                Brand Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-500 transition-colors duration-200">
                <input
                  type="file"
                  name="image"
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full text-sm sm:text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-colors duration-200 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiImage className="text-orange-500" />
                  Preview
                </label>
                <div className="relative inline-block">
                  <img 
                    src={previewImage} 
                    alt="Brand preview" 
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border-2 border-orange-200 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
              >
                <FiSave className="text-lg sm:text-xl" />
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Save Brand"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}