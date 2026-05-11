'use client'
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { notify } from "../../../../helper/helper";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitHandler(event) {
    event.preventDefault();

    const payload = {
      name: event.target.name.value.trim(),
      email: event.target.email.value.trim(),
      password: event.target.password.value,
    };

    if (!payload.name || !payload.email || !payload.password) {
      notify("All fields are required", false);
      return;
    }
    if (payload.password.length < 6) {
      notify("Password must be at least 6 characters", false);
      return;
    }
    if (payload.password !== event.target.confirmPassword.value) {
      notify("Passwords do not match", false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        notify(data.message || "OTP sent to your email!", true);
        // Use encodeURIComponent so special chars in email are safe in URL
        router.push("/verify-otp?email=" + encodeURIComponent(payload.email));
      } else {
        notify(data.message || "Registration failed", false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      notify("Registration failed. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg grid md:grid-cols-2 overflow-hidden">

        {/* Left Branding */}
        <div className="hidden md:flex items-center justify-center bg-teal-600 text-white p-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Join With Us 🚀</h2>
            <p className="text-teal-100">Create your account and start your journey.</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-teal-600 text-center">Create Account</h2>

          <form onSubmit={submitHandler} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder="John Doe"
              />
            </div>

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
                  placeholder="Min. 6 characters"
                />
                <span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 cursor-pointer text-gray-500">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                  placeholder="Re-enter password"
                />
                <span onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-3 cursor-pointer text-gray-500">
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
