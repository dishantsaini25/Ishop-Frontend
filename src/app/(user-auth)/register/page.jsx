'use client'
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { axiosInstance, notify } from "../../../../helper/helper";

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);


  function submitHandler(event) {
    event.preventDefault();
    const payload = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value
    }
    if (!payload.name || !payload.email || !payload.password) {
      notify("All fields are required", false);
      return;
    }
    if (payload.password.length < 6) {
      notify("Password must be at least 6 characters", false);
      return;
    }
    if (payload.password !== event.target.confirmPassword.value) {
      notify("Password and confirm password must be same", false);
      return;
    }
    axiosInstance.post("user/register", payload).then((response) => {
      console.log(response)
      if (response.data.success) {
        event.target.name.value = "";
        event.target.email.value = "";
        event.target.password.value = "";
        event.target.confirmPassword.value = "";
        router.push("/verify-otp?email=" + payload.email)

      }
      notify(response.data.message, response.data.success)
    }).catch((error) => {
      console.log(error, "response")
      notify("Internal Server Error", false);
    })


  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg grid md:grid-cols-2 overflow-hidden">

        {/* Left Branding */}
        <div className="hidden md:flex items-center justify-center bg-teal-600 text-white p-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Join With Us 🚀</h2>
            <p className="text-teal-100">
              Create your account and start your journey.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-teal-600 text-center">
            Create Account
          </h2>

          <form onSubmit={submitHandler} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                name="name"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                name="email"
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
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
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
                />
                <span
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition">
              REGISTER
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}