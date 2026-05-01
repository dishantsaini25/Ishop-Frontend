"use client";
import { useRef, useState } from "react";
import { FiTag, FiLink, FiImage, FiArrowLeft, FiSave, FiX, FiUpload } from "react-icons/fi";
import { axiosInstance, createSlug, notify } from "../../../../../../helper/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const nameRef = useRef();
  const slugRef = useRef();

  function generateSlug() {
    const slug = createSlug(nameRef.current.value);
    slugRef.current.value = slug;
  }

  function handleImageChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function removeImage() {
    setFile(null);
    setPreviewImage(null);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);

    if (!file) {
      notify("Image is required", false);
      setLoading(false);
      return;
    }

    if (nameRef.current.value.length < 3) {
      notify("Name must be at least 3 characters", false);
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", nameRef.current.value);
      form.append("slug", slugRef.current.value);
      form.append("category_image", file);

      const response = await axiosInstance.post("category/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        router.push("/admin/categories");
      }

      notify(response.data.message, response.data.success);
    } catch (error) {
      console.log(error);
      notify(error.response?.data?.message || "Internal server error", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/admin/categories" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition text-sm sm:text-base group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            Back to Categories
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-3">
            Add New Category
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Create a new product category for your store
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
            
            {/* Category Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#ff7b00] focus-within:border-transparent transition-all bg-gray-50/50">
                <FiTag className="text-gray-400 text-lg" />
                <input
                  ref={nameRef}
                  onChange={generateSlug}
                  type="text"
                  placeholder="e.g., Electronics, Fashion, Mobiles"
                  className="w-full outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">This is how customers will see the category</p>
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Slug
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 bg-gray-100">
                <FiLink className="text-gray-400 text-lg" />
                <input
                  ref={slugRef}
                  readOnly
                  type="text"
                  placeholder="auto-generated-slug"
                  className="w-full outline-none bg-transparent text-gray-600 font-mono text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">URL-friendly name (auto-generated)</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Category Image <span className="text-red-500">*</span>
              </label>
              
              {/* Preview */}
              {previewImage && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl flex items-center gap-4">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Image Preview</p>
                    <p className="text-xs text-gray-400">{file?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              )}

              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? "border-[#ff7b00] bg-orange-50" 
                    : "border-gray-300 bg-gray-50/50 hover:bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!previewImage}
                />
                <FiUpload className={`mx-auto text-3xl mb-3 ${dragActive ? "text-[#ff7b00]" : "text-gray-400"}`} />
                <p className="text-sm text-gray-600">
                  {dragActive ? "Drop image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#ff7b00] px-6 py-2.5 text-white font-semibold hover:bg-[#e06b00] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Save Category
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