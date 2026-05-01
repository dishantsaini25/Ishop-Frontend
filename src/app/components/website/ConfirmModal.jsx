'use client';

import { X, AlertTriangle, LogOut } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                </div>

                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="pt-10 pb-6 px-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title || 'Confirm Logout'}
                    </h3>
                    <p className="text-gray-600">
                        {message || 'Are you sure you want to logout? You will need to login again to access your account.'}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex border-t">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 text-gray-600 font-medium hover:bg-gray-50 rounded-bl-2xl transition"
                    >
                        {cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-4 bg-red-600 text-white font-medium hover:bg-red-700 rounded-br-2xl transition flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        {confirmText || 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
}