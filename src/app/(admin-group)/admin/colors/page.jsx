"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchColors } from "@/api/api-call";
import StatusBadge from "@/app/components/admin/StatusBtn";
import { FiEdit, FiPlus, FiLoader, FiEye, FiGrid } from "react-icons/fi";
import DeleteBtn from "@/app/components/admin/DeleteBtn";

export default function ColorsPage() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("table"); // table or grid

    useEffect(() => {
        loadColors();
    }, []);

    const loadColors = async () => {
        setLoading(true);
        const { colors } = await fetchColors();
        setColors(colors || []);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FiLoader className="animate-spin text-[#ff7b00] text-4xl" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Color Management
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Manage, Create, Update and Delete colors
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Toggle - Mobile */}
                    <div className="flex sm:hidden border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 px-3 text-sm ${viewMode === "table" ? "bg-[#ff7b00] text-white" : "bg-gray-100"}`}
                        >
                            <FiGrid />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 px-3 text-sm ${viewMode === "grid" ? "bg-[#ff7b00] text-white" : "bg-gray-100"}`}
                        >
                            <FiEye />
                        </button>
                    </div>

                    <Link href="/admin/colors/add">
                        <button className="flex items-center gap-2 bg-[#ff7b00] text-white px-4 sm:px-5 py-2 rounded-xl hover:opacity-90 transition text-sm sm:text-base">
                            <FiPlus size={18} />
                            Add Color
                        </button>
                    </Link>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
                            <th className="p-3 sm:p-4 text-left">Color</th>
                            <th className="p-3 sm:p-4 text-left">Name</th>
                            <th className="p-3 sm:p-4 text-left hidden md:table-cell">Slug</th>
                            <th className="p-3 sm:p-4 text-left">Status</th>
                            <th className="p-3 sm:p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-500">
                                    No colors found
                                </td>
                            </tr>
                        ) : (
                            colors.map((cl) => (
                                <tr key={cl._id} className="border-t hover:bg-orange-50 transition">
                                    <td className="p-3 sm:p-4">
                                        <div
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 shadow-sm"
                                            style={{ background: cl.color_code }}
                                            title={cl.color_code}
                                        />
                                    </td>
                                    <td className="p-3 sm:p-4 font-medium text-gray-800">{cl.name}</td>
                                    <td className="p-3 sm:p-4 text-gray-500 hidden md:table-cell">{cl.slug}</td>
                                    <td className="p-3 sm:p-4">
                                        <StatusBadge
                                            flag="status"
                                            status={cl.status}
                                            api={`colors/status/${cl._id}`}
                                        />
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Link
                                                href={`/admin/colors/edit/${cl._id}`}
                                                className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition"
                                            >
                                                <FiEdit size={16} className="sm:text-base" />
                                            </Link>
                                            <DeleteBtn api={`colors/delete/${cl._id}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {colors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No colors found
                    </div>
                ) : viewMode === "table" ? (
                    // Mobile Table View
                    <div className="space-y-3">
                        {colors.map((cl) => (
                            <div key={cl._id} className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                                            style={{ background: cl.color_code }}
                                        />
                                        <span className="font-semibold text-gray-800">{cl.name}</span>
                                    </div>
                                    <StatusBadge
                                        flag="status"
                                        status={cl.status}
                                        api={`colors/status/${cl._id}`}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                    Slug: {cl.slug}
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2 border-t">
                                    <Link
                                        href={`/admin/colors/edit/${cl._id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition"
                                    >
                                        <FiEdit size={14} /> Edit
                                    </Link>
                                    <DeleteBtn api={`colors/delete/${cl._id}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Mobile Grid View
                    <div className="grid grid-cols-2 gap-3">
                        {colors.map((cl) => (
                            <div key={cl._id} className="bg-gray-50 rounded-xl p-3 text-center">
                                <div
                                    className="w-12 h-12 rounded-full mx-auto border border-gray-200 shadow-sm mb-2"
                                    style={{ background: cl.color_code }}
                                />
                                <p className="font-semibold text-gray-800 text-sm">{cl.name}</p>
                                <p className="text-xs text-gray-400 mb-2">{cl.slug}</p>
                                <div className="flex items-center justify-center gap-2 pt-2 border-t">
                                    <Link
                                        href={`/admin/colors/edit/${cl._id}`}
                                        className="p-1.5 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200"
                                    >
                                        <FiEdit size={14} />
                                    </Link>
                                    <DeleteBtn api={`colors/delete/${cl._id}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Footer */}
            {colors.length > 0 && (
                <div className="mt-6 pt-4 border-t text-center text-xs sm:text-sm text-gray-500">
                    Total Colors: <span className="font-semibold text-gray-700">{colors.length}</span>
                </div>
            )}
        </div>
    );
}