'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notify } from "../../../../helper/helper";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Properly decode email from URL - handles both encoded and plain
    const params = new URLSearchParams(window.location.search);
    const rawEmail = params.get("email") || '';
    // decodeURIComponent handles %40 -> @ etc.
    try {
      setEmail(decodeURIComponent(rawEmail));
    } catch {
      setEmail(rawEmail);
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // only digits
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

  // Handle paste - fill all 6 boxes at once
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById(`otp-5`)?.focus();
    }
  };

  async function submitHandler(event) {
    event.preventDefault();

    if (!email) {
      notify("Email not found. Please register again.", false);
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      notify("Please enter complete 6-digit OTP", false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: Number(otpValue) }),
      });

      const data = await response.json();

      if (data.success) {
        notify("Email verified! You can now login.", true);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.success) {
        notify("OTP sent! Check your email.", true);
        setOtp(["", "", "", "", "", ""]); // clear old OTP
        document.getElementById('otp-0')?.focus();
      } else {
        notify(data.message || "Failed to resend OTP.", false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        notify("Request timed out. Please try again.", false);
      } else {
        notify("Failed to resend OTP. Please try again.", false);
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-teal-600 mb-2">Verify Your Email</h2>
        <p className="text-gray-500 text-sm mb-1">Enter the 6-digit code sent to</p>
        <p className="text-teal-600 font-semibold text-sm mb-6 break-all">{email || 'your email'}</p>

        <form onSubmit={submitHandler}>
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
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
                className="w-11 h-12 border-2 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-md transition disabled:opacity-50 font-medium"
          >
            {loading ? "Verifying..." : "VERIFY OTP"}
          </button>
        </form>

        <div className="mt-5 space-y-2">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={resendOtp}
              disabled={resending}
              className="text-teal-600 font-medium hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
          <p className="text-xs text-gray-400">
            Check your spam folder if you don&apos;t see it
          </p>
        </div>
      </div>
    </div>
  );
}
