import Link from "next/link";
import { fetchBrand } from "@/api/api-call";
import StatusBadge from "@/app/components/admin/StatusBtn";
import { FiEdit, FiPlus } from "react-icons/fi";
import DeleteBtn from "@/app/components/admin/DeleteBtn";

export default async function page() {

  const { brand, imageBaseUrl } = await fetchBrand();

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Brand Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage Get, Create, Update and Delete
          </p>
        </div>

        <Link href="/admin/brands/add">
          <button className="flex items-center justify-center gap-2 bg-[#ff7b00] text-white px-4 sm:px-5 py-2 rounded-xl hover:opacity-90 transition text-sm sm:text-base">
            <FiPlus size={18} />
            Add Brand
          </button>
        </Link>
      </div>

      {/* ✅ DESKTOP TABLE VIEW - Hidden on mobile, visible on sm and above */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
              <th className="p-3 sm:p-4 text-left">Image</th>
              <th className="p-3 sm:p-4 text-left">Name</th>
              <th className="p-3 sm:p-4 text-left hidden md:table-cell">Slug</th>
              <th className="p-3 sm:p-4 text-left hidden lg:table-cell">Categories</th>
              <th className="p-3 sm:p-4 text-left">Status</th>
              <th className="p-3 sm:p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {brand.map((br) => (
              <tr key={br._id} className="border-t hover:bg-orange-50 transition">
                <td className="p-3 sm:p-4">
                  <img
                    className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                    src={imageBaseUrl + br.image}
                    alt={br.name}
                  />
                 </td>
                <td className="p-3 sm:p-4 font-medium text-gray-800">{br.name}</td>
                <td className="p-3 sm:p-4 text-gray-500 hidden md:table-cell">{br.slug}</td>
                <td className="p-3 sm:p-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {br.category_ids?.length > 0 ? (
                      br.category_ids.slice(0, 2).map((cat) => (
                        <span key={cat._id} className="bg-gray-100 px-2 py-0.5 text-xs rounded">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No Category</span>
                    )}
                    {br.category_ids?.length > 2 && (
                      <span className="text-xs text-gray-400">+{br.category_ids.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <StatusBadge flag="status" status={br.status} api={`brands/status/${br._id}`} />
                    <StatusBadge flag="is_home" status={br.is_home} api={`brands/status/${br._id}`} />
                    <StatusBadge flag="is_best" status={br.is_best} api={`brands/status/${br._id}`} />
                    <StatusBadge flag="is_top" status={br.is_top} api={`brands/status/${br._id}`} />
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/brands/edit/${br._id}`} className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition">
                      <FiEdit size={16} className="sm:text-base" />
                    </Link>
                    <DeleteBtn api={`brands/delete/${br._id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW - Only visible on mobile (below sm) */}
      <div className="sm:hidden space-y-3">
        {brand.map((br) => (
          <div key={br._id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                className="w-12 h-12 object-cover rounded-lg"
                src={imageBaseUrl + br.image}
                alt={br.name}
              />
              <div>
                <h3 className="font-semibold text-gray-800">{br.name}</h3>
                <p className="text-xs text-gray-500">{br.slug}</p>
              </div>
            </div>
            
            {br.category_ids?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {br.category_ids.map((cat) => (
                    <span key={cat._id} className="bg-gray-200 px-2 py-0.5 text-xs rounded">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge flag="status" status={br.status} api={`brands/status/${br._id}`} />
              <StatusBadge flag="is_home" status={br.is_home} api={`brands/status/${br._id}`} />
              <StatusBadge flag="is_best" status={br.is_best} api={`brands/status/${br._id}`} />
              <StatusBadge flag="is_top" status={br.is_top} api={`brands/status/${br._id}`} />
            </div>
            
            <div className="flex items-center gap-3 pt-2 border-t">
              <Link href={`/admin/brands/edit/${br._id}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition text-sm">
                <FiEdit size={14} /> Edit
              </Link>
              <DeleteBtn api={`brands/delete/${br._id}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      {brand.length > 0 && (
        <div className="mt-6 pt-4 border-t text-center text-xs sm:text-sm text-gray-500">
          Total Brands: <span className="font-semibold text-gray-700">{brand.length}</span>
        </div>
      )}
    </div>
  );
}