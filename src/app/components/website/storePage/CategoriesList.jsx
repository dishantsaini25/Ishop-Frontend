"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoriesList({ category }) {
  const pathname = usePathname();

  return (
    <div  className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">
        Categories
      </h3>

      <Link href="/store">
        <button
          className={`w-full mb-3 py-2 rounded-lg border transition font-medium
            ${
              pathname === "/store"
                ? "bg-black text-white"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
        >
          All Categories
        </button>
      </Link>

<ul className="space-y-3 text-sm">
  {category.map((cat) => (
    <Link key={cat._id} href={`/store/${cat.slug}`}>
      <li
        className={`flex justify-between items-center font-medium cursor-pointer transition px-3 py-2 rounded-lg
          ${
            pathname === `/store/${cat.slug}`
              ? "bg-teal-500 text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-black"
          }`}
      >
        <span className="font-semibold">{cat.name}</span>

        <span
          className={`text-xs px-2 py-1 rounded-full
            ${
              pathname === `/store/${cat.slug}`
                ? "bg-white text-teal-600"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {cat.totalProducts ?? 0}
        </span>
      </li>
    </Link>
  ))}
</ul>

    </div>
  );
}
