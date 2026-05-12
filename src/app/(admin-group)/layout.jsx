"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideMenu from "../components/admin/sideMenu";
import Header from "../components/admin/Header";
import { ToastContainer } from "react-toastify";


  const checkAuth = async () => {
    if (pathname === "/admin/login") { setLoading(false); setAuthorized(true); return; }
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const res = await fetch(`${backendUrl}/admin/me`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAuthorized(true);
      else router.push("/admin/login");
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  };const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false);
      setAuthorized(true);
      return;
    }
    
    try {
      const response = await axiosInstance.get("/admin/me");
      if (response.data.success) {
        setAuthorized(true);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };
    return (
      <html lang="en">
        <body className="bg-gray-100">
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7b00]"></div>
          </div>
        </body>
      </html>
    );
  }

  // Login page - no sidebar
  if (pathname === "/admin/login") {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </html>
    );
  }

  // Protected pages with sidebar
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        <div className="min-h-screen w-full flex flex-col md:flex-row">
          <SideMenu />  
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-4 overflow-x-auto">
              {children}
            </main>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}