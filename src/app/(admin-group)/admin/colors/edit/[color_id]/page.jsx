"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { axiosInstance, notify, titleToSlug } from "../../../../../../../helper/helper";

export default function EditColorPage() {
  const { color_id } = useParams();
  const router = useRouter();

  const nameRef = useRef(null);
  const [color, setColor] = useState("#ff7b00");

  // Load Old Data
  useEffect(() => {
    axiosInstance.get(`colors?id=${color_id}`).then((res) => {
      const colorData = res.data.data.colors[0];
      if (!colorData) return;
      nameRef.current.value = colorData.name;
      setColor(colorData.color_code || "#ff7b00");
    });
  }, [color_id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = {
      name: nameRef.current.value,
      slug: titleToSlug(nameRef.current.value),
      color_code: color
    };

    const res = await axiosInstance.put(`colors/update/${color_id}`, form);
    notify(res.data.message, res.data.success);
    if (res.data.success) router.push("/admin/colors");
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Back Button */}
      <Link 
        href="/admin/colors" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ff7b00] transition mb-4 text-sm"
      >
        <FiArrowLeft size={16} />
        Back to Colors
      </Link>

      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Edit Color</h2>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Color Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Color Name
            </label>
            <input
              ref={nameRef}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#ff7b00] outline-none"
            />
          </div>

          {/* Picker + Hex */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Color
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-14 h-14 sm:w-16 sm:h-16 p-1 border rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#ff7b00"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#ff7b00] outline-none"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <div
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-500">{color}</span>
          </div>

          <button className="w-full sm:w-auto bg-[#ff7b00] text-white px-6 py-2 rounded-xl hover:opacity-90 transition">
            Update Color
          </button>
        </form>
      </div>
    </div>
  );
}