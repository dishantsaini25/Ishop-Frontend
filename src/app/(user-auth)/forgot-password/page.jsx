'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance, notify } from '../../../../helper/helper';


export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        
        if (!email) {
            notify('Please enter your email', false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/forgot-password', { email });
            
            if (response.data.success) {
                notify(response.data.message, true);
                setStep(2);
            } else {
                notify(response.data.message, false);
            }
        } catch (error) {
            notify(error.response?.data?.message || 'Failed to send OTP', false);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            notify('Please enter valid 6-digit OTP', false);
            return;
        }
        
        if (!newPassword || newPassword.length < 6) {
            notify('Password must be at least 6 characters', false);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            notify('Passwords do not match', false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/reset-password', {
                email,
                otp,
                new_password: newPassword
            });
            
            if (response.data.success) {
                notify(response.data.message, true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                notify(response.data.message, false);
            }
        } catch (error) {
            notify(error.response?.data?.message || 'Failed to reset password', false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {step === 1 
                            ? 'Enter your email to receive a password reset OTP'
                            : `Enter the OTP sent to ${email}`
                        }
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={sendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-teal-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Sending OTP...' : 'Send Reset OTP'}
                        </button>
                        
                        <p className="text-center text-sm text-gray-500">
                            Remember your password?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="text-teal-600 hover:underline"
                            >
                                Back to Login
                            </button>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={resetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full p-3 text-center text-2xl tracking-widest border rounded-lg focus:outline-none focus:border-teal-500"
                                placeholder="000000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-teal-500"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-teal-500"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-teal-600 hover:underline text-center"
                        >
                            ← Back to Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}