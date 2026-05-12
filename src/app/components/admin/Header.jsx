"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiUser, FiLogOut, FiSettings, FiBellOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { notify } from "../../../../helper/helper";

const bUrl = () => (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function Header() {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [admin, setAdmin] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchAdminData();
        connectSocket();
        fetchNotifications();
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, []);

    const fetchAdminData = async () => {
        try {
            const res = await fetch(`${bUrl()}/admin/me`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setAdmin(data.data);
        } catch {}
    };

    const connectSocket = () => {
        const token = document.cookie.split('admin_token=')[1];
        socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL, { auth: { token } });
        socketRef.current.on('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            notify(notification.message, true);
        });
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${bUrl()}/api/admin/notifications`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) { setNotifications(data.data); setUnreadCount(data.data.filter(n => !n.read).length); }
        } catch {}
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`${bUrl()}/api/admin/notifications/${notificationId}/read`, { method: 'PUT', credentials: 'include' });
            setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${bUrl()}/api/admin/notifications/read-all`, { method: 'PUT', credentials: 'include' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleLogout = async () => {
        try { await fetch(`${bUrl()}/admin/logout`, { method: 'POST', credentials: 'include' }); } catch {}
        router.push('/admin/login');
    };

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'new_order': return '🛒';
            case 'low_stock': return '⚠️';
            case 'new_review': return '⭐';
            case 'new_user': return '👤';
            default: return '🔔';
        }
    };

    return (
        <header className="bg-white shadow-md rounded-xl m-4 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-gray-800">
                        <span className="text-[#ff7b00]">Admin</span> Panel
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <FiBell className="text-xl text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        
                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h3 className="font-semibold">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-y-auto max-h-80">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <FiBellOff className="mx-auto text-3xl mb-2" />
                                                <p>No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                                                        !notif.read ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {new Date(notif.created_at).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                        {!notif.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#ff7b00] hover:bg-[#e06b00] transition"
                        >
                            <FiUser className="text-lg text-white" />
                            <span className="text-sm font-medium text-white hidden sm:inline">
                                {admin?.name || 'Admin'}
                            </span>
                        </button>
                        
                        {showProfileMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="font-medium text-gray-800">{admin?.name}</p>
                                        <p className="text-xs text-gray-500">{admin?.email}</p>
                                        <p className="text-xs text-gray-400 mt-1 capitalize">Role: {admin?.role}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/admin/profile')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <FiSettings size={14} /> Profile Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <FiLogOut size={14} /> Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}