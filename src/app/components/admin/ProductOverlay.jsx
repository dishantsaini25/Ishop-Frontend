"use client";

import React, { useState, useEffect } from "react";
import StatusBadge from "./StatusBtn";
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { notify } from "../../../../helper/helper";
import { useRouter } from "next/navigation";

const bUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const ProductOverlay = ({ product, imageBaseUrl, isOpen, onClose }) => {
  const router = useRouter();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product?.other_images) setImages(product.other_images);
  }, [product]);

  if (!isOpen || !product) return null;

  const Info = ({ label, value }) => (
    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-xs sm:text-sm">{value || "-"}</p>
    </div>
  );

  const handleSingleDelete = async (imageName) => {
    try {
      const res = await fetch(`${bUrl()}/products/other-images/${product._id}?imageName=${imageName}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      notify(data.message, true);
      setImages(images.filter((img) => img !== imageName));
      router.refresh();
    } catch { notify("Delete Failed", false); }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all images?")) return;
    try {
      const res = await fetch(`${bUrl()}/products/other-images/${product._id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      notify(data.message, true);
      setImages([]);
      router.refresh();
    } catch { notify("Delete Failed", false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white w-full max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-red-500"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          
          {/* Description */}
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Main Image */}
          <div className="mb-4">
            <img
              src={product.thumbnail?.startsWith('http') ? product.thumbnail : `${imageBaseUrl}/main/${product.thumbnail}`}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border"
              onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=No+Image"; }}
            />
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
            <span className="line-through text-gray-400 text-sm">
              ₹{product.original_price}
            </span>
            <span className="text-lg sm:text-xl font-semibold text-green-600">
              ₹{product.final_price}
            </span>
            <span className="text-xs sm:text-sm text-red-500">
              ({product.discount_price}% OFF)
            </span>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
            <Info label="Category" value={product.category_id?.name} />
            <Info label="Brand" value={product.brand_id?.name} />
            <Info label="Stock" value={product.stock ? "In Stock" : "Out of Stock"} />
            <Info label="Status" value={product.status ? "Active" : "Inactive"} />
          </div>

          {/* Colors */}
          {product.color_ids?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
                Available Colors
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {product.color_ids.map((color) => (
                  <div
                    key={color._id}
                    title={color.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color.color_code }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Images */}
          {images?.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-medium text-gray-700">
                  More Images ({images.length})
                </h3>
                <button
                  onClick={handleDeleteAll}
                  className="text-xs sm:text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete All
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.startsWith('http') ? img : `${imageBaseUrl}/other/${img}`}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-20 sm:h-24 object-cover rounded-lg border"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/96?text=No+Image"; }}
                    />
                    <button
                      onClick={() => handleSingleDelete(img)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiTrash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Flags */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">
              Product Flags
            </h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                flag="status"
                status={product.status}
                api={`products/status/${product._id}`}
              />
              <StatusBadge
                flag="stock"
                status={product.stock}
                api={`products/status/${product._id}`}
              />
              <StatusBadge
                flag="is_best_seller"
                status={product.is_best_seller}
                api={`products/status/${product._id}`}
              />
              <StatusBadge
                flag="show_home"
                status={product.show_home}
                api={`products/status/${product._id}`}
              />
              <StatusBadge
                flag="is_featured"
                status={product.is_featured}
                api={`products/status/${product._id}`}
              />
              <StatusBadge
                flag="is_hot"
                status={product.is_hot}
                api={`products/status/${product._id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverlay;