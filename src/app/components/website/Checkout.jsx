'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlus, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useRazorpay } from "react-razorpay";
import { axiosInstance, formatIndianCurrency, notify } from "../../../../helper/helper";
import { emptyCart } from "@/redux/reducers/CartSlice";

export default function CheckoutPage({ user }) {
    const { Razorpay } = useRazorpay();
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector((store) => store.cart);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        contact: ''
    });

    useEffect(() => {
    }, []);

    const handleAddressChange = (e) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value
        });
    };

    const saveAddress = async () => {
        if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.contact) {
            notify("Please fill all required fields", false);
            return;
        }

        try {
            const response = await axiosInstance.post(`/user/address/${user._id}`, newAddress);

            if (response.data.success) {
                notify("Address added successfully", true);
                setShowAddressForm(false);
                window.location.reload();
            } else {
                notify("Failed to add address", false);
            }
        } catch (error) {
            console.error("Address save error:", error);
            notify("Error saving address", false);
        }
    };

    async function orderHandler() {
  

        if (selectedAddress === null) {
            notify("Please select a delivery address", false);
            return;
        }

        if (!user?.shipping_address || user.shipping_address.length === 0) {
            notify("Please add a delivery address first", false);
            return;
        }

        if (paymentMethod === null) {
            notify("Please select payment method", false);
            return;
        }

        if (!cart.items || cart.items.length === 0) {
            notify("Your cart is empty", false);
            return;
        }

        setIsProcessing(true);

        try {
            try {
                const syncResponse = await axiosInstance.post("/cart/cart-sync", { 
                    user_id: user._id,
                    cart: cart.items.map(item => ({
                        id: item.id,
                        qty: item.qty
                    }))
                });
                
                
                if (syncResponse.data && syncResponse.data.success === false) {
                    console.warn("Cart sync warning:", syncResponse.data.message);
                    // Don't return, continue with order
                }
            } catch (syncError) {
                console.warn("Cart sync failed but continuing with order:", syncError.message);
            }

            const response = await axiosInstance.post("/order/place", {
                user_id: user._id,
                payment_mode: paymentMethod,
                shipping_details: user.shipping_address[selectedAddress],
                cart_items: cart.items  // ✅ Send cart items directly as backup
            });


            if (!response.data.success) {
                notify(response.data.message || "Order failed", false);
                setIsProcessing(false);
                return;
            }

            if (paymentMethod === 0) {
                // COD
                dispatch(emptyCart());
                router.push(`/thank-you/${response.data.data}`);
                setIsProcessing(false);
            } else {
                // Online Payment
                const options = {
                    key: "rzp_test_hYGOo0vBKlVRkD",
                    amount: response.data.data.amount,
                    currency: "INR",
                    name: "Your Store",
                    description: `Order #${response.data.data.order_id}`,
                    order_id: response.data.data.razorpay_order_id,
                    handler: async (razorpayResponse) => {
                        console.log("Payment success:", razorpayResponse);
                        
                        try {
                            const successResponse = await axiosInstance.post("/order/success", {
                                order_id: response.data.data.order_id,
                                user_id: user._id,
                                razorpay_response: razorpayResponse
                            });

                            if (successResponse.data.success) {
                                dispatch(emptyCart());
                                router.push(`/thank-you/${successResponse.data.order_id}`);
                            } else {
                                notify("Payment verification failed", false);
                            }
                        } catch (error) {
                            console.error("Success API error:", error);
                            notify("Payment verification failed", false);
                        }
                        setIsProcessing(false);
                    },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                            notify("Payment cancelled", false);
                        }
                    }
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.on('payment.failed', (response) => {
                    console.error("Payment failed:", response.error);
                    notify(response.error.description || "Payment failed", false);
                    setIsProcessing(false);
                });
                razorpayInstance.open();
            }

        } catch (error) {
            console.error("Order Error:", error);
            notify(error.response?.data?.message || "Order failed", false);
            setIsProcessing(false);
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SECTION */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Add Address Button */}
                    <div className="bg-white p-5 rounded-xl shadow">
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                        >
                            <FaPlus /> {showAddressForm ? "Cancel" : "Add New Address"}
                        </button>
                    </div>

                    {/* Address Form */}
                    {showAddressForm && (
                        <div className="bg-white p-5 rounded-xl shadow">
                            <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="addressLine1"
                                    placeholder="Address Line 1 *"
                                    value={newAddress.addressLine1}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="addressLine2"
                                    placeholder="Address Line 2 (Optional)"
                                    value={newAddress.addressLine2}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City *"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State *"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="PIN Code *"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="Phone Number *"
                                    value={newAddress.contact}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={newAddress.country}
                                    onChange={handleAddressChange}
                                    className="w-full p-2 border rounded"
                                />
                                <button
                                    onClick={saveAddress}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    Save Address
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Saved Addresses */}
                    <div className="bg-white p-5 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Select Delivery Address
                            {(!user?.shipping_address || user.shipping_address.length === 0) && (
                                <span className="text-red-500 text-sm ml-2">(No address added yet)</span>
                            )}
                        </h2>

                        {user?.shipping_address && user.shipping_address.length > 0 ? (
                            <div className="space-y-4">
                                {user.shipping_address.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedAddress(index)}
                                        className={`border rounded-xl p-4 cursor-pointer transition 
                                        ${selectedAddress === index
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-400"
                                            }`}
                                    >
                                        <p className="text-sm text-gray-600">{item.addressLine1}</p>
                                        {item.addressLine2 && (
                                            <p className="text-sm text-gray-600">{item.addressLine2}</p>
                                        )}
                                        <p className="text-sm text-gray-600">{item.city}, {item.state} - {item.postalCode}</p>
                                        <p className="text-sm text-gray-600">{item.country}</p>
                                        <p className="text-sm text-gray-600">Phone: {item.contact}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No addresses found</p>
                                <p className="text-sm mt-2">Click "Add New Address" to add a delivery address</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-5 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                        <div
                            onClick={() => setPaymentMethod(0)}
                            className={`border p-4 rounded-xl cursor-pointer flex items-center gap-3 mb-3
                            ${paymentMethod === 0 ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                        >
                            <FaMoneyBillWave className="text-green-600" />
                            Cash on Delivery
                        </div>
                        <div
                            onClick={() => setPaymentMethod(1)}
                            className={`border p-4 rounded-xl cursor-pointer flex items-center gap-3
                            ${paymentMethod === 1 ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                        >
                            <FaCreditCard className="text-purple-600" />
                            Online Payment (Razorpay)
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION - Order Summary */}
                <div className="bg-white p-5 rounded-xl shadow h-fit">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span>Total MRP</span>
                            <span>{formatIndianCurrency(cart?.original_total || 0)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>- {formatIndianCurrency((cart?.original_total || 0) - (cart?.final_total || 0))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total Amount</span>
                            <span className="text-red-600 font-bold">
                                {formatIndianCurrency(cart?.final_total || 0)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={orderHandler}
                        disabled={isProcessing || !cart?.items?.length || !user?.shipping_address?.length || selectedAddress === null}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold transition
                        ${isProcessing || !cart?.items?.length || !user?.shipping_address?.length || selectedAddress === null
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-teal-500 hover:bg-teal-700 text-white'
                            }`}
                    >
                        {isProcessing ? "Processing..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}