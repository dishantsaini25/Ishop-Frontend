'use client';

import { useState } from 'react';
import { 
    X, Package, Truck, CheckCircle, Clock, 
    MapPin, Phone, Mail, Calendar, CreditCard, 
    IndianRupee, Download, Receipt, Home,
    ChevronRight, AlertCircle, Printer, Share2
} from 'lucide-react';

export default function OrderDetailsModal({ order, onClose, imageBaseUrl }) {
    const [trackingStatus, setTrackingStatus] = useState('delivered');
    
    if (!order) return null;

    // ✅ Function to get image URL (same as product card)
    const getImageUrl = (thumbnail) => {
        if (!thumbnail) return null;
        if (thumbnail.startsWith('http')) return thumbnail;
        return `${imageBaseUrl}/main/${thumbnail}`;
    };

    // Order status steps
    const orderSteps = [
        { status: 'Order Placed', icon: Package, completed: true, date: order.createdAt },
        { status: 'Processing', icon: Clock, completed: order.order_status >= 0, date: order.createdAt },
        { status: 'Shipped', icon: Truck, completed: order.order_status >= 2, date: order.shippedAt },
        { status: 'Delivered', icon: CheckCircle, completed: order.order_status === 1, date: order.deliveredAt },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 0: return 'bg-yellow-500';
            case 1: return 'bg-green-500';
            case 2: return 'bg-blue-500';
            case 3: return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 0: return 'Processing';
            case 1: return 'Delivered';
            case 2: return 'Shipped';
            case 3: return 'Out for Delivery';
            default: return 'Pending';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Gradient */}
                    <div className="sticky top-0 z-10 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-t-2xl">
                        <div className="px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Receipt className="text-white" size={24} />
                                <div>
                                    <h2 className="text-xl font-bold">Order Details</h2>
                                    <p className="text-teal-100 text-sm">#{order._id?.slice(-12).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <Printer size={18} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <Share2 size={18} />
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        
                        {/* Order Status Card */}
                        <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.order_status)} animate-pulse`}></div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {getStatusText(order.order_status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Steps */}
                            <div className="relative mt-8">
                                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                                <div className="relative flex justify-between">
                                    {orderSteps.map((step, idx) => (
                                        <div key={idx} className="text-center flex-1">
                                            <div className={`
                                                relative z-10 w-10 h-10 mx-auto rounded-full flex items-center justify-center
                                                ${step.completed ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'}
                                            `}>
                                                <step.icon size={18} />
                                            </div>
                                            <p className="text-xs font-medium mt-2 text-gray-700">{step.status}</p>
                                            {step.date && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(step.date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="border rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Package size={18} />
                                    Order Items ({order.product_details?.length || 0})
                                </h3>
                            </div>
                            <div className="divide-y">
                                {order.product_details?.map((item, idx) => (
                                    <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50 transition">
                                        {/* Product Image - ✅ FIXED */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            {item.product_id?.thumbnail ? (
                                                <img 
                                                    src={getImageUrl(item.product_id.thumbnail)} 
                                                    alt={item.product_id?.name || 'Product'}
                                                    className="w-16 h-16 object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <Package className="text-gray-400" size={32} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {item.product_id?.name || 'Product'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Quantity: {item.qty}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₹{item.total?.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ₹{item.price} × {item.qty}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard size={18} />
                                Price Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{order.order_total?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Charges</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (GST)</span>
                                    <span className="text-gray-900">Included</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-900">Total Amount</span>
                                        <span className="font-bold text-xl text-teal-600">
                                            ₹{order.order_total?.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-right">
                                        Inclusive of all taxes
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address & Payment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div className="border rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-teal-600" />
                                    Delivery Address
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-900">{order.shipping_details?.addressLine1}</p>
                                    {order.shipping_details?.addressLine2 && (
                                        <p className="text-gray-600">{order.shipping_details.addressLine2}</p>
                                    )}
                                    <p className="text-gray-600">
                                        {order.shipping_details?.city}, {order.shipping_details?.state}
                                    </p>
                                    <p className="text-gray-600">PIN: {order.shipping_details?.postalCode}</p>
                                    <p className="text-gray-600 flex items-center gap-2 mt-3">
                                        <Phone size={14} />
                                        {order.shipping_details?.contact}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-teal-600" />
                                    Payment Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium text-gray-900">
                                            {order.payment_mode === 1 ? 'Online Payment' : 'Cash on Delivery'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.payment_status === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.payment_status === 1 ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    {order.razorpay_payment_id && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Transaction ID</span>
                                            <span className="text-sm text-gray-500 font-mono">
                                                {order.razorpay_payment_id.slice(-8)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Download Invoice Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <button className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm">
                                <Download size={18} />
                                Download Invoice
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}