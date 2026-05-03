import Link from "next/link";
import StatusBadge from "@/app/components/admin/StatusBtn";
import { FiEdit, FiImage, FiPlus } from "react-icons/fi";
import DeleteBtn from "@/app/components/admin/DeleteBtn";
import ViewButton from "@/app/components/admin/ViewButton";
import { fetchProduct } from "@/api/api-call";
import { FaFileImage } from "react-icons/fa";

export const dynamic = 'force-dynamic';


export default async function page() {

 const { product = [], imageBaseUrl = "" } = await fetchProduct() || {};

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Product Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage Get, Create, Update and Delete
          </p>
        </div>

        <Link href="/admin/products/add">
          <button className="flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-4 sm:px-5 py-2 rounded-xl hover:opacity-90 transition text-sm sm:text-base">
            <FiPlus size={18} />
            Add Product
          </button>
        </Link>
      </div>

      {/* ✅ DESKTOP TABLE VIEW - Hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
              <th className="p-3 sm:p-4 text-left">Thumbnail</th>
              <th className="p-3 sm:p-4 text-left">Name</th>
              <th className="p-3 sm:p-4 text-left hidden md:table-cell">Slug</th>
              <th className="p-3 sm:p-4 text-left">Status</th>
              <th className="p-3 sm:p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {product?.map((prod) => (
              <tr key={prod._id} className="border-t hover:bg-orange-50 transition">
                {/* Thumbnail */}
                <td className="p-3 sm:p-4">
                  {prod.thumbnail ? (
                    <img
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      src={imageBaseUrl + "main/" + prod.thumbnail}
                      alt={prod.name}
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="p-3 sm:p-4 font-medium text-gray-800">
                  <div className="max-w-50 truncate" title={prod.name}>
                    {prod.name}
                  </div>
                </td>

                {/* Slug - Hidden on tablet */}
                <td className="p-3 sm:p-4 text-gray-500 hidden md:table-cell">
                  <div className="max-w-37.5 truncate" title={prod.slug}>
                    {prod.slug}
                  </div>
                </td>

                {/* Status Flags */}
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <StatusBadge
                      flag="status"
                      status={prod.status}
                      api={`products/status/${prod._id}`}
                    />
                    <StatusBadge
                      flag="stock"
                      status={prod.stock}
                      api={`products/status/${prod._id}`}
                    />
                  </div>
                </td>

                {/* Action */}
                <td className="p-2 sm:p-3">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <Link href={`/admin/products/edit/${prod._id}`}>
                      <button className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                        <FiEdit size={16} className="sm:text-base" />
                      </button>
                    </Link>

                    <DeleteBtn api={`products/delete/${prod._id}`} />
                    
                    <ViewButton product={prod} imageBaseUrl={imageBaseUrl} />

                    <Link href={`/admin/products/other_images/${prod._id}`}>
                      <button className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                        <FaFileImage size={16} className="sm:text-base" />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW - Only visible on mobile */}
      <div className="sm:hidden space-y-3">
        {product?.map((prod) => (
          <div key={prod._id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              {prod.thumbnail ? (
                <img
                  className="w-14 h-14 object-cover rounded-lg"
                  src={imageBaseUrl + "main/" + prod.thumbnail}
                  alt={prod.name}
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FiImage className="text-gray-400 text-xl" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {prod.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{prod.slug}</p>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge
                flag="status"
                status={prod.status}
                api={`products/status/${prod._id}`}
              />
              <StatusBadge
                flag="stock"
                status={prod.stock}
                api={`products/status/${prod._id}`}
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Link href={`/admin/products/edit/${prod._id}`} className="flex-1">
                <button className="w-full flex items-center justify-center gap-1 py-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition text-xs">
                  <FiEdit size={12} /> Edit
                </button>
              </Link>
              
              <div className="flex gap-2">
                <ViewButton product={prod} imageBaseUrl={imageBaseUrl} />
                
                <Link href={`/admin/products/other_images/${prod._id}`}>
                  <button className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                    <FaFileImage size={14} />
                  </button>
                </Link>
                
                <DeleteBtn api={`products/delete/${prod._id}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      {product.length > 0 && (
        <div className="mt-6 pt-4 border-t text-center text-xs sm:text-sm text-gray-500">
          Total Products: <span className="font-semibold text-gray-700">{product.length}</span>
        </div>
      )}
    </div>
  );
}