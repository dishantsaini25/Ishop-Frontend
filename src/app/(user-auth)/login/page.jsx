"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { notify } from "../../../../helper/helper";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitHandler(event) {
    event.preventDefault();

    const payload = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    if (!payload.email || !payload.password) {
      notify("All fields are required", false);
      return;
    }

    if (payload.password.length < 6) {
      notify("Password must be at least 6 characters", false);
      return;
    }

    try {
      setLoading(true);

      // Use Next.js proxy to avoid CORS issues
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        notify(data.message || "Login failed", false);
        return;
      }

      // Cart sync with backend if local cart has items
      try {
        const localCart = JSON.parse(localStorage.getItem("cart"));
        const cartItems = localCart?.items || [];

        if (cartItems.length > 0) {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')}/cart/cart-sync`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cartItems, user_id: data.data.id }),
          }).catch(() => {});
        }
      } catch (_) {}

      notify("Login Successful", true);

      // Hard redirect - faster than router.push + router.refresh()
      // This forces server to re-run getUser() so header shows user name
      window.location.href = '/';

    } catch (error) {
      console.error('Login error:', error);
      notify("Login failed. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg grid md:grid-cols-2 overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex items-center justify-center bg-teal-600 text-white p-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Welcome Back 👋</h2>
            <p className="text-teal-100">
              Login to continue shopping and manage your account.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-teal-600 text-center">Sign In</h2>

          <form onSubmit={submitHandler} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                  placeholder="••••••"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-teal-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal-600 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
