'use client'
import { useState } from "react";

import { useRouter } from "next/navigation";
import { axiosInstance, notify } from "../../../../helper/helper";

export default function VerifyOtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };


  function submitHandler(event) {
    event.preventDefault();
    const payload = {
      email: new URLSearchParams(window.location.search).get("email"),
      otp: Number(otp.join(""))
    }
    axiosInstance.post("user/otp-verify", payload).then((response) => {

      if (response.data.success) {
        router.push("/login")
      }
      notify(response.data.message, response.data.success)
    }).catch((error) => {
      console.log(error, "response")
      notify("Internal Server Error", false);
    })


  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-teal-600 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6 digit code sent to your email
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 border rounded-md text-center text-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          ))}
        </div>

        <button onClick={submitHandler} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition">
          VERIFY OTP
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive code?{" "}
          <span  className="text-teal-600 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
}