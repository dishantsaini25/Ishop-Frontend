"use client";

import { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage, 
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiPrinter,
  FiLoader
} from "react-icons/fi";

import Link from "next/link";
import { axiosInstance, notify } from "../../../../../helper/helper";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("weekly");
  const [reports, setReports] = useState({
    sales: {},
    orders: {},
    products: {},
    customers: {},
    inventory: {},
    financial: {}
  });

  useEffect(() => {
    fetchReports();
  }, [activeTab, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/reports?type=${activeTab}&range=${dateRange}`);
      if (response.data.success) {
        setReports(prev => ({ ...prev, [activeTab]: response.data.data }));
      }
    } catch (error) {
      console.error(error);
      notify("Failed to load reports", false);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "sales", name: "Sales", icon: <FiDollarSign /> },
    { id: "orders", name: "Orders", icon: <FiShoppingCart /> },
    { id: "products", name: "Products", icon: <FiPackage /> },
    { id: "customers", name: "Customers", icon: <FiUsers /> },
    { id: "inventory", name: "Inventory", icon: <FiTrendingUp /> },
    { id: "financial", name: "Financial", icon: <FiDollarSign /> },
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "yearly", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const currentReport = reports[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View store performance and insights
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <FiPrinter className="text-gray-500" />
          </button>
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <FiDownload className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span className="text-sm text-gray-600">Date Range:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm transition ${
                  dateRange === option.value
                    ? "bg-[#ff7b00] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-1 sm:gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? "bg-[#ff7b00] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="animate-spin text-[#ff7b00] text-3xl" />
          </div>
        ) : (
          <>
            {/* Sales Report */}
            {activeTab === "sales" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Sales Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{currentReport?.totalSales?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentReport?.totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Average Order Value</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{currentReport?.avgOrderValue?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {currentReport?.conversionRate || "0"}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Report */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Order Status Distribution</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {currentReport?.pendingOrders || 0}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Processing</p>
                    <p className="text-xl font-bold text-blue-600">
                      {currentReport?.processingOrders || 0}
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Shipped</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {currentReport?.shippedOrders || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-xl font-bold text-green-600">
                      {currentReport?.deliveredOrders || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-xl font-bold text-red-600">
                      {currentReport?.cancelledOrders || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Report */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Top Selling Products</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Sold</th>
                        <th className="px-4 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentReport?.topProducts?.map((product, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.soldCount || 0}</td>
                          <td className="px-4 py-3">₹{product.revenue?.toLocaleString() || "0"}</td>
                        </tr>
                      ))}
                      {(!currentReport?.topProducts || currentReport.topProducts.length === 0) && (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-gray-500">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customers Report */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Customer Insights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentReport?.totalCustomers || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">New Customers</p>
                    <p className="text-2xl font-bold text-green-600">
                      {currentReport?.newCustomers || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Returning Customers</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {currentReport?.returningCustomers || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Report */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentReport?.lowStockProducts?.map((product, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.stock || 0}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!currentReport?.lowStockProducts || currentReport.lowStockProducts.length === 0) && (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-gray-500">
                            No low stock products
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Financial Report */}
            {activeTab === "financial" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Financial Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{currentReport?.totalRevenue?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Refunds</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{currentReport?.totalRefunds?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Net Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{currentReport?.netRevenue?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {currentReport?.profitMargin || "0"}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}