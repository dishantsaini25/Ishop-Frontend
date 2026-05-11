import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

// ==================== AXIOS INSTANCE ====================
const axiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, '') + '/',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any request transformations here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        // Only redirect to admin login if on admin pages
        if (path.startsWith('/admin') && !path.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
        // For user pages, do nothing - let the component handle it
      }
    }
    return Promise.reject(error);
  }
);

// ==================== HELPER FUNCTIONS ====================

function createSlug(slug) {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const notify = (message, flag) => {
  toast(message, { 
    type: flag ? "success" : "error",
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const titleToSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
};

function formatIndianCurrency(amount) {
  const value = Number(amount);
  if (isNaN(value)) return "₹0";
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ==================== ADD THESE NEW HELPER FUNCTIONS ====================

// Format date to readable string
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format date with time
const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get order status badge color
const getOrderStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    out_for_delivery: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Get payment status badge color
const getPaymentStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Truncate text
const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

// Export all
export { 
  createSlug, 
  notify, 
  axiosInstance, 
  titleToSlug, 
  formatIndianCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusColor,
  getPaymentStatusColor,
  truncateText
};