export const dynamic = 'force-dynamic';

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with our team for any questions or support.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-teal-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-600 text-sm">Sales & Support</p>
            <p className="text-teal-600 font-medium mt-2">+91 98765 43210</p>
            <p className="text-gray-500 text-sm mt-1">Mon-Sat, 9AM-8PM</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-teal-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600 text-sm">Drop us a message</p>
            <p className="text-teal-600 font-medium mt-2">support@swootech.com</p>
            <p className="text-gray-500 text-sm mt-1">24/7 Response</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-teal-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">Corporate Office</p>
            <p className="text-teal-600 font-medium mt-2">Jaipur, Rajasthan</p>
            <p className="text-gray-500 text-sm mt-1">India</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-teal-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Working Hours</h3>
            <p className="text-gray-600 text-sm">Monday - Saturday</p>
            <p className="text-teal-600 font-medium mt-2">9:00 AM - 8:00 PM</p>
            <p className="text-gray-500 text-sm mt-1">Sunday Closed</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6">Fill out the form below and we'll get back to you soon.</p>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Sales & Pricing">Sales & Pricing</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our privacy policy.
              </p>
            </form>
          </div>

          {/* Map & Location */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-64 w-full bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0000000000005!2d75.7872709!3d26.9124476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3d000000000%3A0x0!2zMjbCsDU0JzQ0LjgiTiA3NcKwNDcnMTQuMiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Our Location</h3>
                <p className="text-gray-600">
                  Swoo Tech Mart,<br />
                  Plot No. 123, Corporate Park,<br />
                  Jaipur, Rajasthan - 302001<br />
                  India
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <Link href="https://facebook.com" target="_blank" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition">
                  <FaFacebook size={20} />
                </Link>
                <Link href="https://twitter.com" target="_blank" className="w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition">
                  <FaTwitter size={20} />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition">
                  <FaInstagram size={20} />
                </Link>
                <Link href="https://youtube.com" target="_blank" className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition">
                  <FaYoutube size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}