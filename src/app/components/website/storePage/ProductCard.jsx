"use client";
import { useState } from "react";
import Link from "next/link"; 
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AddToCartBtn from "./AddToCartBtn";

export default function ProductCard({ product, imageBaseUrl, user }) {
  const imageUrl = `${imageBaseUrl}/main/${product.thumbnail}`;
  const [fav, setFav] = useState(false);
  const discountAmount = (product.original_price || 0) - (product.final_price || 0);
  
  const productSlug = product.slug;

  return (
    <Link href={`/product/${productSlug || product._id}`} className="block">
      <div className="relative bg-[#f5f5f5] rounded-2xl p-4 flex flex-col h-full transition hover:shadow-xl cursor-pointer">

        {product.discount_price > 0 && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold">
            SAVE ₹{discountAmount}
          </div>
        )}

        <div
          onClick={(e) => {
            e.preventDefault();  // ✅ Link ko trigger hone se rokta hai
            setFav(!fav);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
        >
          {fav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </div>

        <div className="flex justify-center py-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-32 object-contain"
          />
        </div>

        <h3 className="text-lg font-semibold mt-2 line-clamp-2 min-h-14">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-500 text-xl font-bold">
            ₹{product.final_price}
          </span>
          {product.discount_price > 0 && (
            <span className="line-through text-gray-400">
              ₹{product.original_price}
            </span>
          )}
        </div>

        <div className="mt-3">
          {product.stock ? (
            <div className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-lg">
              In Stock
            </div>
          ) : (
            <div className="inline-block bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg">
              Out of Stock
            </div>
          )}
        </div>

        <AddToCartBtn 
          user={user} 
          stock={product.stock} 
          id={product._id} 
          name={product.name} 
          final_price={product.final_price} 
          original_price={product.original_price} 
          thumbnail={imageUrl} 
          color_ids={product.color_ids} 
        />
      </div>
    </Link>
  );
}