"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    MdDashboard, 
    MdCategory, 
    MdShoppingCart,
    MdPeople,
    MdSettings,
    MdBarChart
} from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { CiClock1 } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { TbBrandProducthunt } from "react-icons/tb";
import { FiMenu, FiX } from "react-icons/fi";

export default function SideMenu() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const items = [
        { name: "Dashboard", link: "/admin", icon: <MdDashboard />, exact: true },
        { name: "Categories", link: "/admin/categories", icon: <MdCategory />, exact: false },
        { name: "Colors", link: "/admin/colors", icon: <IoIosColorPalette />, exact: false },
        { name: "Brands", link: "/admin/brands", icon: <CiClock1 />, exact: false },
        { name: "Products", link: "/admin/products", icon: <TbBrandProducthunt />, exact: false },
        { name: "Orders", link: "/admin/orders", icon: <MdShoppingCart />, exact: false },
        { name: "Customers", link: "/admin/customers", icon: <MdPeople />, exact: false },
        { name: "Reports", link: "/admin/reports", icon: <MdBarChart />, exact: false },
        { name: "Settings", link: "/admin/settings", icon: <MdSettings />, exact: false },
    ];

    // ✅ Function to check if current route is active
    const isActiveRoute = (item) => {
        if (item.exact) {
            return pathname === item.link;
        }
        // For nested routes like /admin/categories/edit/123
        return pathname === item.link || pathname.startsWith(item.link + "/");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-[#ff7b00] text-white rounded-lg shadow-lg"
            >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white min-h-screen shadow-xl flex-col sticky top-0">
                <div className="p-4 sm:p-5 border-b">
                    <h1 className="text-xl sm:text-2xl font-bold">
                        <span className="text-[#ff7b00]">Admin</span>
                        <span className="text-gray-800"> Panel</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">Manage your store</p>
                </div>
                <nav className="flex flex-col gap-1 p-3 flex-1">
                    {items.map((item, index) => {
                        const isActive = isActiveRoute(item);
                        return (
                            <Link key={index} href={item.link}>
                                <div
                                    className={`flex items-center p-3 rounded-lg transition cursor-pointer
                                    ${isActive
                                        ? "bg-[#ff7b00] text-white shadow-md"
                                        : "text-gray-700 hover:bg-orange-50"
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="text-sm sm:text-base">{item.name}</span>
                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto"></div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                        onClick={toggleMobileMenu} 
                    />
                    <aside className="fixed left-0 top-0 z-40 w-64 bg-white h-full shadow-xl flex-col animate-slide-right md:hidden overflow-y-auto">
                        <div className="p-4 border-b pt-16">
                            <h1 className="text-xl font-bold">
                                <span className="text-[#ff7b00]">Admin</span>
                                <span className="text-gray-800"> Panel</span>
                            </h1>
                            <p className="text-xs text-gray-400 mt-1">Manage your store</p>
                        </div>
                        <nav className="flex flex-col gap-1 p-3">
                            {items.map((item, index) => {
                                const isActive = isActiveRoute(item);
                                return (
                                    <Link key={index} href={item.link} onClick={toggleMobileMenu}>
                                        <div
                                            className={`flex items-center p-3 rounded-lg transition cursor-pointer
                                            ${isActive
                                                ? "bg-[#ff7b00] text-white shadow-md"
                                                : "text-gray-700 hover:bg-orange-50"
                                            }`}
                                        >
                                            <span className="mr-3 text-lg">{item.icon}</span>
                                            <span className="text-sm">{item.name}</span>
                                            {isActive && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto"></div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}