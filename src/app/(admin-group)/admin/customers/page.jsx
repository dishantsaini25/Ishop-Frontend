"use client";

import { useState, useEffect } from "react";
import { FiEye, FiSearch, FiUserX, FiUserCheck, FiLoader } from "react-icons/fi";

import Link from "next/link";
import { axiosInstance, notify } from "../../../../../helper/helper";

export default function CustomersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/admin/users");
            setUsers(response.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const response = await axiosInstance.put(`/admin/users/${userId}/status`, {
                status: !currentStatus
            });
            if (response.data.success) {
                notify(`User ${!currentStatus ? 'activated' : 'blocked'} successfully`, true);
                fetchUsers();
            }
        } catch (error) {
            notify("Failed to update user status", false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage registered customers</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#ff7b00] text-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">User</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Email</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Orders</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell">Joined</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FiLoader className="animate-spin mx-auto text-[#ff7b00] text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-gray-500 sm:hidden">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 hidden sm:table-cell">{user.email}</td>
                                        <td className="px-4 sm:px-6 py-3 hidden md:table-cell">{user.total_orders || 0}</td>
                                        <td className="px-4 sm:px-6 py-3 hidden lg:table-cell text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.status !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.status !== false ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="flex gap-2">
                                                <Link href={`/admin/customers/${user._id}`}>
                                                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                                                        <FiEye className="text-gray-600" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => toggleUserStatus(user._id, user.status)}
                                                    className={`p-2 rounded-lg transition ${
                                                        user.status !== false 
                                                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {user.status !== false ? <FiUserX /> : <FiUserCheck />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}