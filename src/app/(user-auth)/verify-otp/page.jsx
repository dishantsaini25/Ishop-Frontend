'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "../../../../helper/helper";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get("email")
    : null;

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  async function submitHandler(event) {
    event.preventDefault();

    if (!email) {
      notify("Email not found. Please register again.", false);
      return;
    }

    if (otp.join("").length !== 6) {
      notify("Please enter complete 6-digit OTP", false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: Number(otp.join("")) }),
      });

      const data = await response.json();

      if (data.success) {
        notify(data.message || "Email verified successfully!", true);
        router.push("/login");
      } else {
        notify(data.message || "Invalid OTP. Please try again.", false);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      notify("Verification failed. Please try again.", false);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (!email) {
      notify("Email not found. Please register again.", false);
      return;
    }

    setResending(true);
    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      notify(data.message || "OTP resent!", data.success);
    } catch (error) {
      notify("Failed to resend OTP. Please try again.", false);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-teal-600 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-500 text-sm mb-1">
          Enter the 6-digit code sent to
        </p>
        <p className="text-teal-600 font-medium text-sm mb-6">{email}</p>

        <form onSubmit={submitHandler}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border-2 rounded-md text-center text-lg font-semibold focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "VERIFY OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Didn&apos;t receive code?{" "}
          <button
            onClick={resendOtp}
            disabled={resending}
            className="text-teal-600 cursor-pointer hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}
