import Link from "next/link";

export default async function ThankYouPage({ params }) {
    const order = await params;
    const orderId = order.order_id;
    console.log(orderId);

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="text-green-500 text-5xl mb-3">✓</div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
                    <p className="text-gray-500 mt-2">
                        Thank you for shopping with us. Your order has been received.
                    </p>
                </div>

                {/* Order Info */}
                <div className="border-b pb-4 mb-6">
                    <div className="flex justify-between py-2">
                        <span className="font-semibold text-gray-700">Order ID:</span>
                        <span className="text-gray-600 font-mono">{orderId}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-semibold text-gray-700">Payment Status:</span>
                        <span className="text-green-600 font-medium">Successful</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-semibold text-gray-700">Order Status:</span>
                        <span className="text-yellow-600 font-medium">Processing</span>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>• You will receive a confirmation email shortly</li>
                        <li>• Order will be processed within 24 hours</li>
                        <li>• Tracking details will be shared once shipped</li>
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/store">
                        <button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                            Continue Shopping
                        </button>
                    </Link>

                    {/* ✅ View Orders - Direct to Profile Orders Tab */}
                    <Link href="/profile?tab=orders">
                        <button className="w-full sm:w-auto border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition">
                            View My Orders
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}