export const dynamic = 'force-dynamic';

'use client';

import Link from 'next/link';
import { FaTruck, FaShieldAlt, FaHeadset, FaCreditCard } from 'react-icons/fa';


export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-teal-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Swoo Tech Mart</h1>
                    <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
                        Your trusted partner for quality electronics and gadgets since 2020
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At Swoo Tech Mart, we believe everyone deserves access to the latest technology 
                            at affordable prices. We curate the best products from trusted brands and deliver 
                            them right to your doorstep with exceptional customer service.
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-4">
                            Founded in 2020, we've grown from a small startup to one of India's most trusted 
                            online electronics retailers, serving over 100,000+ happy customers.
                        </p>
                    </div>
                    <div className="bg-teal-100 rounded-2xl p-8 text-center">
                        <div className="text-5xl font-bold text-teal-600 mb-2">100K+</div>
                        <p className="text-gray-600">Happy Customers</p>
                        <div className="text-5xl font-bold text-teal-600 mt-6 mb-2">500+</div>
                        <p className="text-gray-600">Products</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">Why Choose Us?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTruck className="text-teal-600 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
                            <p className="text-gray-500 text-sm">On orders over ₹199</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="text-teal-600 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
                            <p className="text-gray-500 text-sm">100% secure transactions</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHeadset className="text-teal-600 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
                            <p className="text-gray-500 text-sm">Dedicated customer care</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCreditCard className="text-teal-600 text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Easy Returns</h3>
                            <p className="text-gray-500 text-sm">30 days money back guarantee</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Shop?</h2>
                    <p className="text-gray-600 mb-8">Explore our collection of premium electronics</p>
                    <Link 
                        href="/store" 
                        className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
}