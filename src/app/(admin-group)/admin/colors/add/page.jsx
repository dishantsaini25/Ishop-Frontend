"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { axiosInstance, notify, titleToSlug } from "../../../../../../helper/helper";

export default function AddColorPage() {
  const nameRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#ff7b00");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = {
      name: nameRef.current.value,
      slug: titleToSlug(nameRef.current.value),
      color_code: color
    };

    try {
      const res = await axiosInstance.post("colors/create", form);
      notify(res.data.message, res.data.success);
      if (res.data.success) router.push("/admin/colors");
    } catch (error) {
      console.log(error);
      notify("Internal Server Error", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-xl">
        
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/admin/colors" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <FiArrowLeft size={16} />
            Back to Colors
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Add New Color
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Create a new color for your products
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
            
            {/* Color Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Color Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                placeholder="Enter Color Name (e.g., Red, Blue, Green)"
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#ff7b00] focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            {/* Color Picker + Hex Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Color <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Color Picker */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 sm:w-14 sm:h-14 p-1 border rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 sm:hidden">Pick a color</span>
                </div>

                {/* Hex Input */}
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#ff7b00"
                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#ff7b00] focus:border-transparent outline-none transition text-sm sm:text-base font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter hex code (e.g., #ff0000 for red)</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Preview:</span>
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-500 font-mono">{color}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
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
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Add Color
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