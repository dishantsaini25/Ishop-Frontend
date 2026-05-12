"use client";
import { useRef, useState } from "react";
import { FiTag, FiLink, FiImage, FiArrowLeft, FiSave, FiX } from "react-icons/fi";
import { createSlug, notify } from "../../../../helper/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export default function EditCategory({ category, imageBaseUrl }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    category.image?.startsWith('http') ? category.image : imageBaseUrl + category.image
  );
  const nameRef = useRef();
  const slugRef = useRef();

  function generateSlug() {
    slugRef.current.value = createSlug(nameRef.current.value);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);

    const form = new FormData();
    if (nameRef.current.value !== category.name) {
      form.append("name", nameRef.current.value);
      form.append("slug", slugRef.current.value);
    }
    if (event.target.categoryImage.files[0]) {
      form.append("image", event.target.categoryImage.files[0]);
    }

    try {
      const res = await fetch(`${backendUrl()}/category/update/${category._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form,
      });
      const data = await res.json();
      if (data.success) router.push("/admin/categories");
      notify(data.message, data.success);
    } catch {
      notify("Update failed. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  const currentImgSrc = category.image?.startsWith('http')
    ? category.image
    : imageBaseUrl + category.image;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">

        <div className="mb-4 sm:mb-6">
          <Link href="/admin/categories" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-3 text-sm">
            <FiArrowLeft size={16} /> Back to Categories
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Category</h1>
        </div>

        <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 space-y-5">

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Category Name <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#ff7b00] transition">
              <FiTag className="text-gray-400 shrink-0" />
              <input ref={nameRef} defaultValue={category.name} onChange={generateSlug} type="text" className="w-full outline-none bg-transparent" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Slug</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
              <FiLink className="text-gray-400 shrink-0" />
              <input ref={slugRef} defaultValue={category.slug} readOnly type="text" className="w-full outline-none bg-transparent text-gray-600" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Category Image</label>
            {previewImage && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-3">
                <img src={previewImage} alt="Preview" className="w-14 h-14 object-cover rounded-lg border" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Current Image</p>
                </div>
                {previewImage !== currentImgSrc && (
                  <button type="button" onClick={() => setPreviewImage(currentImgSrc)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#ff7b00]">
              <FiImage className="text-gray-400 shrink-0" />
              <input type="file" accept="image/*" name="categoryImage" onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100" />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#ff7b00] px-6 py-2.5 text-white hover:opacity-90 transition disabled:opacity-50 text-sm">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><FiSave size={16} />Save Category</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
