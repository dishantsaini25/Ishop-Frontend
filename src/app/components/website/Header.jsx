'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaUserCircle, FaSearch, FaStore, FaPhoneAlt, FaShieldAlt, FaTruck, FaUser } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { lsToCart } from "@/redux/reducers/CartSlice";
import { formatIndianCurrency } from "../../../../helper/helper";

export default function Header({ user }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart);

  useEffect(() => {
    dispatch(lsToCart());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?search=${searchQuery}`);
    }
  };
  
  const handleOrderTracking = () => {
    if (user) {
      router.push('/profile?tab=orders');
    } else {
      router.push('/login?redirect=profile');
    }
  };
  
  const handleSellOnSwoo = () => {
    router.push('/admin');
  };

  return (
    <>
      <header className="w-full border-b border-gray-100 sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          
          {/* TOP BAR - Desktop/Tablet only */}
          <div className="hidden md:flex items-center justify-between px-4 lg:px-10 py-2 text-xs bg-gray-50">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button className="rounded-md bg-teal-600 text-white px-4 py-1.5 text-[12px] font-medium hover:bg-teal-700 transition flex items-center gap-2">
                <FaPhoneAlt size={10} />
                Hotline 24/7
              </button>
              <span className="font-bold text-gray-700 text-[12px]">
                (025) 3886 25 16
              </span>
            </div>

            {/* RIGHT - Sell on Swoo & Order Tracking for Desktop/Tablet */}
            <div className="flex items-center gap-6 text-gray-600 text-[12px]">
              <button 
                onClick={handleSellOnSwoo}
                className="cursor-pointer hover:text-teal-600 transition"
              >
                Sell on Swoo
              </button>
              <button 
                onClick={handleOrderTracking}
                className="cursor-pointer hover:text-teal-600 transition"
              >
                Order Tracking
              </button>
            </div>
          </div>

          {/* MAIN BAR */}
          <div className="flex items-center justify-between px-4 lg:px-10 py-4">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-14 items-center justify-center rounded-2xl bg-teal-600 group-hover:bg-teal-700 transition">
                <img className="mt-2 w-8" src="/image/Vector 1.png" alt="logo" />
              </div>
              <div>
                <p className="text-black font-bold text-[16px] tracking-wide">SWOO</p>
                <p className="text-gray-500 font-medium text-[12px] -mt-1">TECH MART</p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700">
              <Link href="/" className="hover:text-teal-600 transition">HOME</Link>
              <Link href="/store" className="hover:text-teal-600 transition">STORE</Link>
              <Link href="/about" className="hover:text-teal-600 transition">ABOUT</Link>
              <Link href="/contact" className="hover:text-teal-600 transition">CONTACT</Link>
            </nav>

            {/* RIGHT SECTION - Desktop only */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">WELCOME</p>
                {user ? (
                  <Link href="/profile" className="font-semibold text-sm hover:text-teal-600 transition flex items-center gap-1">
                    <FaUser size={12} />
                    {user.name?.split(' ')[0]}
                  </Link>
                ) : (
                  <Link href="/login" className="font-semibold text-sm hover:text-teal-600 transition">
                    LOG IN / REGISTER
                  </Link>
                )}
              </div>

              <Link href="/cart">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 group-hover:bg-teal-50 transition">
                    <BsCart4 className="text-xl text-gray-700 group-hover:text-teal-600 transition" />
                    <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cart?.items?.length || 0}
                    </span>
                  </div>
                  <div className="text-xs leading-tight hidden xl:block">
                    <p className="uppercase text-gray-400">Cart</p>
                    <p className="font-bold text-gray-800">
                      {formatIndianCurrency(cart?.final_total || 0)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* MOBILE + TABLET MENU BUTTON */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Cart Icon for Mobile & Tablet */}
              <Link href="/cart">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <BsCart4 className="text-lg text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart?.items?.length || 0}
                  </span>
                </div>
              </Link>
              
              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex flex-col justify-between h-6 w-7"
              >
                <span className={`h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-gray-800 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </button>
            </div>
          </div>

          {/* MOBILE MENU - Only for mobile, with Sell on Swoo and Order Tracking */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 px-4 pb-5 pt-3 bg-white shadow-lg">
              <div className="border-b pb-4 mb-3">
                <p className="text-xs text-gray-400 mb-1">WELCOME</p>
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold text-base text-teal-600 flex items-center gap-2"
                  >
                    <FaUserCircle size={20} />
                    {user.name}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold text-base text-teal-600 block"
                  >
                    LOG IN / REGISTER
                  </Link>
                )}
              </div>

              <nav className="flex flex-col gap-4 text-base font-medium text-gray-700">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-teal-600 py-1">
                  HOME
                </Link>
                <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="hover:text-teal-600 py-1">
                  STORE
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-teal-600 py-1">
                  ABOUT
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-teal-600 py-1">
                  CONTACT
                </Link>
                <hr className="my-2" />
                
                {/* ✅ Sell on Swoo - Mobile Menu only */}
                <button 
                  onClick={() => {
                    handleSellOnSwoo();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-teal-600 py-1"
                >
                  Sell on Swoo
                </button>
                
                {/* ✅ Order Tracking - Mobile Menu only */}
                <button 
                  onClick={() => {
                    handleOrderTracking();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-teal-600 py-1"
                >
                  Order Tracking
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* SEARCH BAR */}
        <div className="bg-[#119E97] py-4">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            {/* DESKTOP VIEW */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="w-130 bg-white rounded-full flex items-center overflow-hidden">
                <select className="bg-gray-100 px-4 py-3 text-sm outline-none rounded-l-full">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Mobiles</option>
                  <option>Laptops</option>
                </select>
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm outline-none"
                />
                <button onClick={handleSearch} className="px-5 text-gray-700">
                  <FaSearch className="text-[16px]" />
                </button>
              </div>

              <div className="flex items-center gap-12 text-white text-sm font-medium">
                <span>FREE SHIPPING OVER $199</span>
                <span>30 DAYS MONEY BACK</span>
                <span>100% SECURE PAYMENT</span>
              </div>
            </div>

            {/* MOBILE + TABLET SEARCH */}
            <div className="lg:hidden">
              <div className="w-full bg-white rounded-full flex items-center overflow-hidden">
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm outline-none"
                />
                <button onClick={handleSearch} className="px-5 text-gray-700">
                  <FaSearch className="text-[16px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}