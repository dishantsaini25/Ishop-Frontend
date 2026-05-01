import Link from "next/link";
import { fetchCategory } from "@/api/api-call";
import StatusBadge from "@/app/components/admin/StatusBtn";
import {
  FiEdit,
  FiPlus,
  FiImage,
} from "react-icons/fi"
import DeleteBtn from "@/app/components/admin/DeleteBtn";

export default async function page() {
  const { category, imageBaseUrl } = await fetchCategory();
  
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Category Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage Get, Create, Update, and Delete
          </p>
        </div>

        <Link href="/admin/categories/add">
          <button className="flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-4 sm:px-5 py-2 rounded-xl hover:opacity-90 transition text-sm sm:text-base">
            <FiPlus size={18} />
            Add Category
          </button>
        </Link>
      </div>

      {/* ✅ DESKTOP TABLE VIEW - Hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
              <th className="p-3 sm:p-4 text-left">Image</th>
              <th className="p-3 sm:p-4 text-left">Name</th>
              <th className="p-3 sm:p-4 text-left hidden md:table-cell">Slug</th>
              <th className="p-3 sm:p-4 text-left">Status</th>
              <th className="p-3 sm:p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {category.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-orange-50 transition">
                <td className="p-3 sm:p-4">
                  {cat.image ? (
                    <img 
                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg" 
                      src={imageBaseUrl + cat.image} 
                      alt={cat.name} 
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                 </td>
                <td className="p-3 sm:p-4 font-medium text-gray-800">{cat.name}</td>
                <td className="p-3 sm:p-4 text-gray-500 hidden md:table-cell">{cat.slug}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <StatusBadge flag="status" status={cat.status} api={`category/status/${cat._id}`} />
                    <StatusBadge flag="is_home" status={cat.is_home} api={`category/status/${cat._id}`} />
                    <StatusBadge flag="is_best" status={cat.is_best} api={`category/status/${cat._id}`} />
                    <StatusBadge flag="is_top" status={cat.is_top} api={`category/status/${cat._id}`} />
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/categories/edit/${cat._id}`}
                      className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition"
                    >
                      <FiEdit size={16} className="sm:text-base" />
                    </Link>
                    <DeleteBtn api={`category/delete/${cat._id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW - Only visible on mobile */}
      <div className="sm:hidden space-y-3">
        {category.map((cat) => (
          <div key={cat._id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              {cat.image ? (
                <img 
                  className="w-12 h-12 object-cover rounded-lg" 
                  src={imageBaseUrl + cat.image} 
                  alt={cat.name} 
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FiImage className="text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.slug}</p>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge flag="status" status={cat.status} api={`category/status/${cat._id}`} />
              <StatusBadge flag="is_home" status={cat.is_home} api={`category/status/${cat._id}`} />
              <StatusBadge flag="is_best" status={cat.is_best} api={`category/status/${cat._id}`} />
              <StatusBadge flag="is_top" status={cat.is_top} api={`category/status/${cat._id}`} />
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t">
              <Link 
                href={`/admin/categories/edit/${cat._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition text-sm"
              >
                <FiEdit size={14} /> Edit
              </Link>
              <DeleteBtn api={`category/delete/${cat._id}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      {category.length > 0 && (
        <div className="mt-6 pt-4 border-t text-center text-xs sm:text-sm text-gray-500">
          Total Categories: <span className="font-semibold text-gray-700">{category.length}</span>
        </div>
      )}
    </div>
  );
}