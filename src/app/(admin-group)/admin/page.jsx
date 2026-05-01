"use client";

import React, { useState, useEffect } from "react";
import {
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiBox,
    FiTrendingUp,
    FiPackage,
    FiLoader
} from "react-icons/fi";
import Link from "next/link";
import { axiosInstance, notify } from "../../../../helper/helper";


export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        pendingOrders: 0,
        lowStock: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Call your backend dashboard API
            const response = await axiosInstance.get("/admin/dashboard/stats");
            
            console.log("Dashboard API Response:", response.data);
            
            if (response.data.success) {
                const data = response.data.data;
                
                // Map backend response to frontend stats format
                setStats({
                    totalUsers: data.users?.total || data.totalUsers || 0,
                    totalOrders: data.orders?.total || data.totalOrders || 0,
                    totalRevenue: data.revenue?.total || data.totalRevenue || 0,
                    totalProducts: data.products?.total || data.totalProducts || 0,
                    pendingOrders: data.orders?.pending || data.pendingOrders || 0,
                    lowStock: data.products?.low_stock || data.lowStock || 0
                });
                
                // Set recent orders
                setRecentOrders(data.recentOrders || data.orders?.recent || []);
            } else {
                notify(response.data.message || "Failed to load dashboard", false);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            notify(error.response?.data?.message || "Failed to load dashboard data", false);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { 
            title: "Total Users", 
            value: stats.totalUsers, 
            icon: <FiUsers />, 
            color: "bg-blue-50 text-blue-600", 
            link: "/admin/customers" 
        },
        { 
            title: "Total Orders", 
            value: stats.totalOrders, 
            icon: <FiShoppingCart />, 
            color: "bg-green-50 text-green-600", 
            link: "/admin/orders" 
        },
        { 
            title: "Total Revenue", 
            value: `₹${stats.totalRevenue.toLocaleString()}`, 
            icon: <FiDollarSign />, 
            color: "bg-purple-50 text-purple-600", 
            link: "/admin/orders" 
        },
        { 
            title: "Products", 
            value: stats.totalProducts, 
            icon: <FiBox />, 
            color: "bg-orange-50 text-orange-600", 
            link: "/admin/products" 
        },
        { 
            title: "Pending Orders", 
            value: stats.pendingOrders, 
            icon: <FiTrendingUp />, 
            color: "bg-yellow-50 text-yellow-600", 
            link: "/admin/orders?status=pending" 
        },
        { 
            title: "Low Stock", 
            value: stats.lowStock, 
            icon: <FiPackage />, 
            color: "bg-red-50 text-red-600", 
            link: "/admin/products?stock=low" 
        },
    ];

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <FiLoader className="animate-spin text-[#ff7b00] text-4xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Overview of your store
                </p>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {statsCards.map((item, index) => (
                    <Link key={index} href={item.link}>
                        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition cursor-pointer">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">{item.title}</p>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                                    {item.value}
                                </h2>
                            </div>
                            <div className={`text-xl sm:text-2xl p-2 sm:p-3 rounded-full ${item.color}`}>
                                {item.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b flex justify-between items-center flex-wrap gap-3">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        Recent Orders
                    </h2>
                    <Link href="/admin/orders">
                        <button className="text-sm text-[#ff7b00] hover:underline">
                            View All →
                        </button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Order ID</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Customer</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Amount</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-3 font-medium">
                                            {order.order_number || order._id?.slice(-8) || "N/A"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 hidden sm:table-cell">
                                            {order.user_id?.name || order.customer_name || "Guest"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 font-semibold">
                                            ₹{(order.total_amount || order.order_total || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.order_status)}`}>
                                                {order.order_status || order.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <button className="text-[#ff7b00] hover:underline text-sm">
                                                    View
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