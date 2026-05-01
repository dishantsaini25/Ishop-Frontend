"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";

export default function FilterToggleWrapper({ children }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // children ko array me convert kar rahe hain
  const items = Array.isArray(children) ? children : children.props.children;

  return (
    <>
      {/* Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* MOBILE VIEW */}
      {open && (
        <div className="lg:hidden bg-white rounded-xl p-4 shadow-md">

          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            {["Categories", "Brand", "Color", "Price"].map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  activeTab === index
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div>
            {items[activeTab]}
          </div>
        </div>
      )}

      {/* DESKTOP VIEW (Normal Sidebar) */}
      <div className="hidden lg:block space-y-6">
        {children}
      </div>
    </>
  );
}
