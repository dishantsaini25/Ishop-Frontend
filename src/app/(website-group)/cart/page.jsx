'use client'

export const dynamic = 'force-dynamic';

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link';
import { formatIndianCurrency } from '../../../../helper/helper';
import { increaseQty, decreaseQty, removeItem } from "@/redux/reducers/CartSlice";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';


export default function Page() {
    const cart = useSelector((store) => store.cart);
    const dispatch = useDispatch();

    if (!cart?.items?.length) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingBag className="text-gray-400 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
                    <Link href="/store" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition">
                        <FaArrowLeft size={16} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                    <p className="text-gray-500 text-sm mt-1">{cart?.items?.length} item(s) in your cart</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* LEFT SIDE - Cart Items */}
                    <div className="flex-1 lg:flex-2 space-y-4">
                        {cart?.items?.map((data) => (
                            <div key={data.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition hover:shadow-md">
                                
                                {/* Mobile Layout (Stacked) */}
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    
                                    {/* IMAGE SECTION */}
                                    <div className="relative w-full sm:w-36 h-48 sm:h-36 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                            SAVE {data.discount_percentage}%
                                        </span>
                                        <img 
                                            src={data.thumbnail} 
                                            alt={data.name}
                                            className="h-28 sm:h-28 object-contain" 
                                        />
                                    </div>

                                    {/* DETAILS SECTION */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div>
                                                <h2 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-2">
                                                    {data.name}
                                                </h2>
                                                {/* Stock Status - Mobile */}
                                                <div className="mt-1 sm:hidden">
                                                    {data.stock ? (
                                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
                                                    ) : (
                                                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Price Section */}
                                            <div className="text-left sm:text-right">
                                                <p className="text-red-500 text-xl sm:text-2xl font-bold">
                                                    {formatIndianCurrency(data.final_price)}
                                                </p>
                                                <p className="text-gray-400 line-through text-sm">
                                                    {formatIndianCurrency(data.original_price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* QTY & ACTIONS - Mobile Friendly */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                                                <button
                                                    onClick={() => dispatch(decreaseQty(data.id))}
                                                    className="px-3 sm:px-4 py-2 hover:bg-gray-200 transition disabled:opacity-50"
                                                    disabled={data.qty <= 1}
                                                >
                                                    <FaMinus size={12} />
                                                </button>
                                                <span className="px-4 sm:px-6 py-2 text-sm font-medium">{data.qty}</span>
                                                <button
                                                    onClick={() => dispatch(increaseQty(data.id))}
                                                    className="px-3 sm:px-4 py-2 hover:bg-gray-200 transition"
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => dispatch(removeItem(data.id))}
                                                className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition text-sm"
                                            >
                                                <FaTrash size={14} />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>

                                            {/* Free Shipping Badge */}
                                            <span className="text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
                                                FREE SHIPPING
                                            </span>
                                        </div>

                                        {/* Stock Status - Desktop */}
                                        <div className="hidden sm:block mt-3">
                                            {data.stock ? (
                                                <span className="text-xs text-green-600">✓ In Stock</span>
                                            ) : (
                                                <span className="text-xs text-red-600">✗ Out of Stock</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE - Order Summary */}
                    <div className="lg:flex-1">
                        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Sub Total</span>
                                    <span className="font-medium text-gray-800">
                                        {formatIndianCurrency(cart?.original_total || 0)}
                                    </span>
                                </div>

                                {/* Discount */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Discount</span>
                                    <span className="text-green-600 font-medium">
                                        - {formatIndianCurrency((cart?.original_total || 0) - (cart?.final_total || 0))}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>

                                {/* Tax */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Estimated Tax</span>
                                    <span className="text-gray-800">Included</span>
                                </div>

                                <hr className="my-3" />

                                {/* Total */}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-semibold text-gray-800">Total Amount</span>
                                    <span className="text-xl md:text-2xl font-bold text-teal-600">
                                        {formatIndianCurrency(cart?.final_total || 0)}
                                    </span>
                                </div>

                                {/* Savings Info */}
                                <div className="bg-green-50 rounded-lg p-3 mt-4">
                                    <p className="text-green-700 text-xs text-center">
                                        🎉 You saved {formatIndianCurrency((cart?.original_total || 0) - (cart?.final_total || 0))} on this order
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <Link href="/checkout">
                                    <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-[1.02]">
                                        Proceed to Checkout
                                    </button>
                                </Link>

                                {/* Continue Shopping Link */}
                                <div className="text-center mt-4">
                                    <Link href="/store" className="text-teal-600 hover:underline text-sm inline-flex items-center gap-1">
                                        <FaArrowLeft size={12} />
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Bar - Mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <p className="text-green-600 font-semibold text-sm">✓ Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders ₹199+</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <p className="text-green-600 font-semibold text-sm">✓ 30 Days Return</p>
                        <p className="text-xs text-gray-500">Easy returns policy</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm col-span-2 md:col-span-1">
                        <p className="text-green-600 font-semibold text-sm">✓ Secure Payment</p>
                        <p className="text-xs text-gray-500">100% secure checkout</p>
                    </div>
                </div>
            </div>
        </div>
    )
}