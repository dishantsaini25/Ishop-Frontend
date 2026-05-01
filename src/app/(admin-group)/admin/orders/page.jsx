"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiSearch, FiFilter, FiDownload, FiLoader } from "react-icons/fi";
import { axiosInstance, notify } from "../../../../../helper/helper";


export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/admin/orders?status=${filter}`);
            setOrders(response.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, { status });
            if (response.data.success) {
                notify("Order status updated", true);
                fetchOrders();
            }
        } catch (error) {
            notify("Failed to update status", false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            confirmed: "bg-blue-100 text-blue-700",
            processing: "bg-purple-100 text-purple-700",
            shipped: "bg-indigo-100 text-indigo-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const filteredOrders = orders.filter(order =>
        order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        order.user_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user_id?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const statusOptions = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage customer orders</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                    <FiDownload /> Export
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm capitalize transition ${
                                filter === status
                                    ? "bg-[#ff7b00] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative sm:ml-auto w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#ff7b00] text-sm"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Order ID</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Customer</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Amount</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Payment</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell">Date</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <FiLoader className="animate-spin mx-auto text-[#ff7b00] text-2xl" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-3 font-medium">
                                            {order.order_number || order._id.slice(-8)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 hidden sm:table-cell">
                                            {order.user_id?.name || "Guest"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 font-semibold">
                                            ₹{order.total_amount?.toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 hidden md:table-cell">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.payment_status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-1 focus:ring-[#ff7b00] ${getStatusBadge(order.order_status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 hidden lg:table-cell text-gray-500">
                                            {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                                                    <FiEye className="text-gray-600" />
                                                </button>
                                            </Link>
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