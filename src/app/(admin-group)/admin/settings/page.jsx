"use client";

import { useState } from "react";
import { FiSettings, FiImage } from "react-icons/fi";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    site_name: "My Store",
    email: "admin@gmail.com",
    phone: "+91 9876543210",
    currency: "INR",
    address: "Delhi, India",
    dark_mode: false
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function submitHandler(e) {
    e.preventDefault();
    console.log(formData);
    alert("Settings Saved (Backend connect later)");
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FiSettings className="text-3xl text-orange-500" />
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <form
        onSubmit={submitHandler}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-8"
      >

        {/* ===== SITE DETAILS ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Site Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-sm font-medium">
                Site Name
              </label>
              <input
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Contact Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
              </select>
            </div>

          </div>
        </div>

        {/* ===== ADDRESS ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Address
          </h2>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* ===== LOGO UPLOAD ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Site Logo
          </h2>

          <div className="flex items-center gap-4 border rounded-xl p-4">
            <FiImage className="text-2xl text-gray-400" />
            <input type="file" accept="image/*" />
          </div>
        </div>

        {/* ===== DARK MODE ===== */}
        <div className="flex items-center justify-between border-t pt-6">
          <div>
            <h2 className="text-lg font-semibold">
              Dark Mode
            </h2>
            <p className="text-sm text-gray-500">
              Enable dark mode for admin panel
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="dark_mode"
              checked={formData.dark_mode}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* SAVE BUTTON */}
        <div className="text-right pt-6">
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition"
          >
            Save Settings
          </button>
        </div>

      </form>
    </div>
  );
}
