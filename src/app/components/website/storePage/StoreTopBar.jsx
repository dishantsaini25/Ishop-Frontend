"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function StoreTopBar({ title }) {
  return (
    <div className="bg-[#FFFFFF] my-5 rounded-2xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-5">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/store" className="hover:text-black">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{title}</span>
        </div>

      </div>
    </div>
  );
}
