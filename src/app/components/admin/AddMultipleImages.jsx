"use client";
import { useRef, useState } from "react";
import { FiImage, FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { notify } from "../../../../helper/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

const backendUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export default function AddMultipleImages({ id, other_images, imageBaseUrl }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(index) {
    URL.revokeObjectURL(previewImages[index]);
    setSelectedFiles((p) => p.filter((_, i) => i !== index));
    setPreviewImages((p) => p.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submitHandler(event) {
    event.preventDefault();
    if (!selectedFiles.length) { notify("Select at least one image", false); return; }
    setLoading(true);
    const form = new FormData();
    selectedFiles.forEach((img) => form.append("other_images", img));
    try {
      const res = await fetch(`${backendUrl()}/products/images/${id}`, {
        method: "POST", credentials: "include", body: form,
      });
      const data = await res.json();
      notify(data.message, data.success);
      if (data.success) router.push("/admin/products");
    } catch { notify("Upload failed. Please try again.", false); }
    finally { setLoading(false); }
  }

  const imgBase = imageBaseUrl || `${backendUrl()}/images/product/`;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-4 text-sm">
          <FiArrowLeft size={16} /> Back to Products
        </Link>
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Product Images</h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">Upload multiple images for your product</p>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Product Images <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#ff7b00] transition">
                <FiImage className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500 text-sm mb-1">Click to select images</p>
                <p className="text-gray-400 text-xs mb-4">JPG, PNG, WebP supported</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100 cursor-pointer" />
              </div>
            </div>
            {previewImages.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">New Images ({previewImages.length})</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewImages.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p} alt="" className="w-full h-24 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><FiX size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {other_images?.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">Existing Images ({other_images.length})</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {other_images.map((img, i) => (
                    <img key={i} src={img.startsWith('http') ? img : `${imgBase}other/${img}`} alt="" className="w-full h-24 object-cover rounded-lg border" />
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm">Cancel</button>
              <button type="submit" disabled={loading || !selectedFiles.length} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</> : <><FiUpload size={16} />Upload Images</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
