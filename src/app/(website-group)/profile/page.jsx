'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, Mail, Phone, MapPin, Home, ShoppingBag,
  LogOut, Edit2, Save, X, Trash2, Plus,
  ChevronRight, CreditCard, Truck, Package,
  Shield, Bell, Heart, Settings, Camera,
  Calendar, Clock, CheckCircle, Download,
  AlertCircle, Key, Lock
} from "lucide-react";
import { axiosInstance, notify } from "../../../../helper/helper";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam === 'orders' ? 'orders' : 'overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageBaseUrl, setImageBaseUrl] = useState('http://localhost:5000/images/product');

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: '' });

  // Address state
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    contact: ''
  });

  // ✅ Password state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0
  });

  // ==================== FETCH FUNCTIONS ====================

  useEffect(() => {
    fetchUser();
    fetchOrders();
    fetchImageBaseUrl();
  }, []);

  const fetchImageBaseUrl = async () => {
    try {
      const response = await axiosInstance.get('/products?page=1&limit=1');
      if (response.data.success && response.data.data.imageBaseUrl) {
        setImageBaseUrl(response.data.data.imageBaseUrl);
      }
    } catch (error) {
      console.error('Fetch image base URL error:', error);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/user/me');
      if (response.data.success) {
        setUser(response.data.data);
        setEditForm({ name: response.data.data.name });
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/order/my-orders');
      if (response.data.success) {
        setOrders(response.data.data);
        setStats({
          totalOrders: response.data.data.length,
          totalSpent: response.data.data.reduce((sum, order) => sum + order.order_total, 0)
        });
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
  };

  // ==================== PROFILE FUNCTIONS ====================

  const updateProfile = async () => {
    if (!editForm.name) {
      notify('Name is required', false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/user/update', {
        user_id: user._id,
        name: editForm.name
      });

      if (response.data.success) {
        setUser({ ...user, name: editForm.name });
        notify('Profile updated successfully', true);
        setIsEditing(false);
      } else {
        notify(response.data.message || 'Update failed', false);
      }
    } catch (error) {
      notify('Error updating profile', false);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== ADDRESS FUNCTIONS ====================

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const addAddress = async () => {
    if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.contact) {
      notify('Please fill all required fields', false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/user/address/${user._id}`, newAddress);
      if (response.data.success) {
        notify('Address added successfully', true);
        setShowAddressForm(false);
        setNewAddress({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          contact: ''
        });
        fetchUser();
      }
    } catch (error) {
      notify('Error adding address', false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/user/address/${user._id}/${editingAddressIndex}`, newAddress);
      if (response.data.success) {
        notify('Address updated successfully', true);
        setEditingAddressIndex(null);
        setShowAddressForm(false);
        fetchUser();
      }
    } catch (error) {
      notify('Error updating address', false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (index) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/user/address/${user._id}/${index}`);
      if (response.data.success) {
        notify('Address deleted successfully', true);
        fetchUser();
      }
    } catch (error) {
      notify('Error deleting address', false);
    } finally {
      setIsLoading(false);
    }
  };

  const editAddress = (address, index) => {
    setNewAddress(address);
    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  // ==================== CHANGE PASSWORD FUNCTION (FIXED WITH TOAST) ====================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    console.log("=== PASSWORD CHANGE REQUEST ===");
    console.log("Current Password:", passwordData.current_password);
    console.log("New Password:", passwordData.new_password);

    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      notify('Please fill all fields', false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      notify('New password and confirm password do not match', false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      notify('Password must be at least 6 characters', false);
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await axiosInstance.put('/user/change-password', {
        user_id: user._id,
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        notify('Password changed successfully!', true);
        // Clear form on success
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        // ✅ This will show error message from backend (including "Current password is incorrect")
        notify(response.data.message, false);
      }
    } catch (error) {
      console.error("Password change error:", error);

      // ✅ IMPORTANT: Handle error response properly for toast
      if (error.response) {
        // Server responded with error status (401, 400, 500, etc.)
        const errorMessage = error.response.data?.message || 'Failed to change password';
        console.log("Error message from server:", errorMessage);
        notify(errorMessage, false);
      } else if (error.request) {
        // Request was made but no response
        notify('Network error. Please check your connection.', false);
      } else {
        // Something else happened
        notify('An error occurred. Please try again.', false);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };
  // ==================== LOGOUT FUNCTIONS ====================

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/user/logout');
      if (response.data.success) {
        localStorage.clear();
        notify('Logged out successfully', true);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      notify('Error logging out', false);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== HELPER FUNCTIONS ====================

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith('http')) return thumbnail;
    return `${imageBaseUrl}/main/${thumbnail}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-700';
      case 0: return 'bg-yellow-100 text-yellow-700';
      case 2: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Delivered';
      case 0: return 'Processing';
      case 2: return 'Shipped';
      default: return 'Pending';
    }
  };

  const getMemberSince = (date) => {
    if (!date) return 'Recently joined';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently joined';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const tabClass = (tab) =>
    `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === tab
      ? 'bg-teal-50 text-teal-700'
      : 'text-gray-700 hover:bg-gray-50'
    }`;

  // ==================== LOADING STATE ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Account</h1>
              <p className="text-teal-100 mt-1">Manage your profile and orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ==================== SIDEBAR ==================== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">

              {/* Profile Summary */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mt-3">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Verified Account
                </p>
              </div>

              {/* Navigation Menu */}
              <div className="p-4 space-y-1">
                <button onClick={() => setActiveTab("overview")} className={tabClass("overview")}>
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button onClick={() => setActiveTab("orders")} className={tabClass("orders")}>
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} />
                    <span>My Orders</span>
                  </div>
                  {stats.totalOrders > 0 && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                      {stats.totalOrders}
                    </span>
                  )}
                </button>

                <button onClick={() => setActiveTab("addresses")} className={tabClass("addresses")}>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>Addresses</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button onClick={() => setActiveTab("security")} className={tabClass("security")}>
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    <span>Security</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button onClick={() => setActiveTab("settings")} className={tabClass("settings")}>
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Settings</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* ==================== MAIN CONTENT ==================== */}
          <div className="lg:col-span-3 space-y-6">

            {/* ==================== OVERVIEW TAB ==================== */}
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                      </div>
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Package className="text-teal-600" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalSpent.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="text-emerald-600" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm text-gray-500">Full Name</div>
                      {isEditing ? (
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ name: e.target.value })}
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-teal-500" />
                      ) : (
                        <div className="flex-1 font-medium text-gray-900">{user?.name}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm text-gray-500">Email Address</div>
                      <div className="flex-1 text-gray-900">{user?.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm text-gray-500">Member Since</div>
                      <div className="flex-1 text-gray-900">
                        {getMemberSince(user?.createdAt)}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button onClick={updateProfile} disabled={isLoading}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => { setIsEditing(false); setEditForm({ name: user?.name }); }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ==================== ORDERS TAB ==================== */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
                  <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="mx-auto text-gray-300" size={64} />
                      <p className="text-gray-500 mt-4">No orders yet</p>
                      <button onClick={() => router.push('/store')}
                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => setSelectedOrder(order)}>
                          <div className="flex justify-between items-start flex-wrap gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap mb-2">
                                <span className="font-mono text-sm text-gray-500">
                                  #{order._id.slice(-8).toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                  {getStatusText(order.order_status)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-gray-600 mt-2">{order.product_details?.length} item(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">₹{order.order_total?.toLocaleString()}</p>
                              <button className="mt-2 text-teal-600 hover:underline flex items-center gap-1 text-sm">
                                View Details <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex gap-3">
                            {order.product_details?.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.product_id?.thumbnail ? (
                                  <img src={getImageUrl(item.product_id.thumbnail)} alt={item.product_id?.name}
                                    className="w-12 h-12 object-contain"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+Image'; }} />
                                ) : (
                                  <Package size={24} className="text-gray-400" />
                                )}
                              </div>
                            ))}
                            {order.product_details?.length > 4 && (
                              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                                +{order.product_details.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== ADDRESSES TAB ==================== */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                  <button onClick={() => {
                    setShowAddressForm(!showAddressForm); setEditingAddressIndex(null); setNewAddress({
                      addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', contact: ''
                    });
                  }} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    <Plus size={16} /> Add Address
                  </button>
                </div>
                <div className="p-6">
                  {showAddressForm && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h3 className="font-semibold mb-3">{editingAddressIndex !== null ? 'Edit Address' : 'New Address'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" name="addressLine1" placeholder="Address Line 1 *" value={newAddress.addressLine1} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="text" name="addressLine2" placeholder="Address Line 2" value={newAddress.addressLine2} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="text" name="city" placeholder="City *" value={newAddress.city} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="text" name="state" placeholder="State *" value={newAddress.state} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="text" name="postalCode" placeholder="PIN Code *" value={newAddress.postalCode} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="tel" name="contact" placeholder="Phone Number *" value={newAddress.contact} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                        <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleAddressChange} className="p-3 border rounded-lg" />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={editingAddressIndex !== null ? updateAddress : addAddress} disabled={isLoading}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                          {isLoading ? 'Saving...' : (editingAddressIndex !== null ? 'Update' : 'Save')}
                        </button>
                        <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {user?.shipping_address?.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto text-gray-300" size={64} />
                      <p className="text-gray-500 mt-4">No addresses saved</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user?.shipping_address?.map((address, index) => (
                        <div key={index} className="border rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{address.addressLine1}</p>
                              {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                              <p className="text-gray-600">{address.city}, {address.state} - {address.postalCode}</p>
                              <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                                <Phone size={12} /> {address.contact}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => editAddress(address, index)} className="text-blue-600 hover:text-blue-700">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => deleteAddress(index)} className="text-red-600 hover:text-red-700">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== SECURITY TAB ==================== */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Key className="text-teal-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Enter your current password and set a new password</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter your current password"
                          required
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Match Indicator */}
                    {passwordData.new_password && passwordData.confirm_password && (
                      <div className={`text-xs ${passwordData.new_password === passwordData.confirm_password ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordData.new_password === passwordData.confirm_password
                          ? '✓ Passwords match'
                          : '✗ Passwords do not match'}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Key size={18} />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      onClick={() => router.push('/forgot-password')}
                      className="text-teal-600 hover:underline text-sm flex items-center justify-center gap-1"
                    >
                      Forgot your password? Reset via email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== SETTINGS TAB ==================== */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive order updates and offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ==================== LOGOUT CONFIRMATION MODAL ==================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="pt-10 pb-6 px-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout? You will need to login again to access your account.</p>
            </div>
            <div className="flex border-t">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 text-gray-600 font-medium hover:bg-gray-50 rounded-bl-2xl transition">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 py-4 bg-red-600 text-white font-medium hover:bg-red-700 rounded-br-2xl transition flex items-center justify-center gap-2">
                <LogOut size={18} /> Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ORDER DETAILS MODAL ==================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setSelectedOrder(null)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 z-10 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-t-2xl">
                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Package className="text-white" size={24} />
                    <div>
                      <h2 className="text-xl font-bold">Order Details</h2>
                      <p className="text-teal-100 text-sm">#{selectedOrder._id?.slice(-12).toUpperCase()}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(selectedOrder.order_status).replace('text-', 'bg-').replace('700', '500')}`}></div>
                        <span className="text-lg font-semibold text-gray-900">{getStatusText(selectedOrder.order_status)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b">
                    <h3 className="font-semibold text-gray-900">Order Items ({selectedOrder.product_details?.length || 0})</h3>
                  </div>
                  <div className="divide-y">
                    {selectedOrder.product_details?.map((item, idx) => (
                      <div key={idx} className="p-6 flex gap-4 hover:bg-gray-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.product_id?.thumbnail ? (
                            <img src={getImageUrl(item.product_id.thumbnail)} alt={item.product_id?.name}
                              className="w-16 h-16 object-contain"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }} />
                          ) : (
                            <Package className="text-gray-400" size={32} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.product_id?.name || 'Product'}</h4>
                              <p className="text-sm text-gray-500 mt-1">Quantity: {item.qty}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">₹{item.total?.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">₹{item.price} × {item.qty}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{selectedOrder.order_total?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="font-bold text-xl text-teal-600">₹{selectedOrder.order_total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-teal-600" /> Delivery Address
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{selectedOrder.shipping_details?.addressLine1}</p>
                    {selectedOrder.shipping_details?.addressLine2 && <p className="text-gray-600">{selectedOrder.shipping_details.addressLine2}</p>}
                    <p className="text-gray-600">{selectedOrder.shipping_details?.city}, {selectedOrder.shipping_details?.state}</p>
                    <p className="text-gray-600">PIN: {selectedOrder.shipping_details?.postalCode}</p>
                    <p className="text-gray-600 flex items-center gap-2"><Phone size={14} /> {selectedOrder.shipping_details?.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}