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
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  }

  function removeFile(index) {
    URL.revokeObjectURL(previewImages[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submitHandler(event) {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      notify("Please select at least one image", false);
      return;
    }
    setLoading(true);

    const form = new FormData();
    for (const img of selectedFiles) {
      form.append("other_images", img);
    }

    try {
      const res = await fetch(`${backendUrl()}/products/images/${id}`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      notify(data.message, data.success);
      if (data.success) router.push("/admin/products");
    } catch {
      notify("Upload failed. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  const imgBase = imageBaseUrl || `${backendUrl()}/images/product/`;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-4xl">

        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-4 text-sm">
          <FiArrowLeft size={16} /> Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Product Images</h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">Upload multiple images for your product</p>

          <form onSubmit={submitHandler} className="space-y-6">

            {/* Upload area */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#ff7b00] transition">
                <FiImage className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500 text-sm mb-1">Click to select images</p>
                <p className="text-gray-400 text-xs mb-4">JPG, PNG, WebP supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100 cursor-pointer"
                />
              </div>
            </div>

            {/* New image previews */}
            {previewImages.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  New Images ({previewImages.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing images */}
            {other_images?.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Existing Images ({other_images.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {other_images.map((img, index) => (
                    <img key={index} src={`${imgBase}other/${img}`} alt={`Existing ${index + 1}`}
                      className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading || selectedFiles.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</>
                  : <><FiUpload size={16} />Upload Images</>}
              </button>
            </div>

            {selectedFiles.length === 0 && (
              <p className="text-center text-xs text-gray-400">Please select at least one image</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  }

  function removeFile(index) {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Revoke and update previews
    URL.revokeObjectURL(previewImages[index]);
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    setLoading(true);
    
    const form = new FormData();
    for (let img of selectedFiles) {
      form.append("other_images", img);
    }
   
    axiosInstance.post(`products/images/${id}`, form)
      .then((response) => {
        if (response.data.success) {
          router.push("/admin/products");
        }
        notify(response.data.message, response.data.success);
      })
      .catch((error) => {
        console.log(error);
        notify("Internal server error", false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Button */}
        <Link 
          href="/admin/products" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-4 text-sm"
        >
          <FiArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Add Product Images
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Upload multiple images for your product
          </p>

          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-[#ff7b00] transition">
                <FiImage className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-3" />
                <p className="text-gray-500 text-sm mb-2">Drag & drop or click to upload</p>
                <p className="text-gray-400 text-xs mb-4">Upload multiple images (JPG, PNG, WebP)</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#ff7b00] hover:file:bg-orange-100 transition cursor-pointer"
                />
              </div>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Selected Images ({previewImages.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images (if any) */}
            {other_images && other_images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Existing Images ({other_images.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {other_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`http://localhost:5000/images/product/other/${img}`}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
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
                disabled={loading || selectedFiles.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    Upload Images
                  </>
                )}
              </button>
            </div>

            {selectedFiles.length === 0 && (
              <p className="text-center text-xs text-gray-400 -mt-2">
                Please select at least one image to upload
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}