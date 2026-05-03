"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiHeart, 
  FiMinus, 
  FiPlus, 
  FiTruck, 
  FiRefreshCw, 
  FiShield,
  FiStar
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "@/redux/reducers/CartSlice";
import { notify } from "../../../../../helper/helper";

export default function ProductClient({ product, imageBaseUrl, relatedProducts }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cart);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ Get cart item quantity
  const cartItem = cart.items.find(item => item.id === product?._id);
  const quantity = cartItem?.qty || 1;

  // ✅ Helper functions for images
  const getMainImageUrl = (imageName) => {
    if (!imageName) return null;
    if (imageName.startsWith('http')) return imageName;
    return `${imageBaseUrl}/main/${imageName}`;
  };

  const getOtherImageUrl = (imageName) => {
    if (!imageName) return null;
    if (imageName.startsWith('http')) return imageName;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
    return `${baseUrl}/images/product/other/${imageName}`;
  };

  // ✅ Create all images array with proper URLs
  const allImages = [];
  
  // Add main image
  if (product?.thumbnail) {
    allImages.push({
      type: 'main',
      url: getMainImageUrl(product.thumbnail),
      name: product.thumbnail
    });
  }
  
  // Add other images
  if (product?.other_images && product.other_images.length > 0) {
    product.other_images.forEach(img => {
      allImages.push({
        type: 'other',
        url: getOtherImageUrl(img),
        name: img
      });
    });
  }

  // Load recently viewed
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
    setRecentlyViewed(viewed);
  }, []);

  // Update recently viewed
  useEffect(() => {
    if (product && product._id) {
      updateRecentlyViewed();
    }
  }, [product]);

  const updateRecentlyViewed = () => {
    try {
      let viewed = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      viewed = viewed.filter(item => item._id !== product._id);
      viewed.unshift({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        final_price: product.final_price,
        original_price: product.original_price
      });
      viewed = viewed.slice(0, 10);
      localStorage.setItem("recently_viewed", JSON.stringify(viewed));
      setRecentlyViewed(viewed);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Increase quantity
  const increaseQtyHandler = () => {
    if (product.stock && quantity < product.stock) {
      dispatch(increaseQty(product._id));
    } else {
      notify(`Only ${product.stock} items available`, false);
    }
  };

  // ✅ Decrease quantity
  const decreaseQtyHandler = () => {
    if (quantity > 1) {
      dispatch(decreaseQty(product._id));
    }
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!product.stock) {
      notify("Product is out of stock", false);
      return;
    }
    
    if (cartItem) {
      dispatch(increaseQty(product._id));
      notify(`Quantity increased to ${quantity + 1}`, true);
      return;
    }
    
    setAddingToCart(true);
    
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      final_price: product.final_price,
      original_price: product.original_price,
      thumbnail: getMainImageUrl(product.thumbnail),
      discount_percentage: product.original_price > 0
        ? Math.round(((product.original_price - product.final_price) / product.original_price) * 100)
        : 0,
      stock: product.stock,
      qty: 1
    }));
    
    notify("Product added to cart", true);
    setTimeout(() => setAddingToCart(false), 500);
  };

  // ✅ Buy now
  const handleBuyNow = () => {
    if (!product.stock) {
      notify("Product is out of stock", false);
      return;
    }
    
    if (!cartItem) {
      dispatch(addToCart({
        id: product._id,
        name: product.name,
        final_price: product.final_price,
        original_price: product.original_price,
        thumbnail: getMainImageUrl(product.thumbnail),
        discount_percentage: product.original_price > 0
          ? Math.round(((product.original_price - product.final_price) / product.original_price) * 100)
          : 0,
        stock: product.stock,
        qty: 1
      }));
    }
    
    router.push("/checkout");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // If no product
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/store" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-teal-600">Store</Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>
        </div>

        {/* Product Main Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            
            {/* LEFT - Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center h-96">
                {allImages[selectedImage]?.url ? (
                  <img
                    src={allImages[selectedImage].url}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="text-gray-400">No Image Available</div>
                )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex items-center justify-center p-2 ${
                        selectedImage === idx ? "border-teal-600" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Product view ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT - Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {product.is_best_seller && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Best Seller</span>
                )}
                {product.is_hot && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Hot</span>
                )}
                {product.discount_price > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {Math.round(((product.original_price - product.final_price) / product.original_price) * 100)}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl md:text-3xl font-bold text-teal-600">
                  {formatPrice(product.final_price)}
                </span>
                {product.discount_price > 0 && (
                  <>
                    <span className="text-sm md:text-base text-gray-400 line-through ml-3">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-xs md:text-sm text-green-600 ml-2">
                      Save {formatPrice(product.original_price - product.final_price)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mb-4">
                {product.stock ? (
                  <span className="text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                  {product.description}
                </p>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQtyHandler}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQtyHandler}
                    disabled={!product.stock || quantity >= product.stock}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.stock} units available
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {cartItem ? `Add More (${quantity})` : addingToCart ? "Adding..." : `Add to Cart`}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.stock}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <FiHeart />
                </button>
              </div>

              {/* Shipping */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiTruck />
                  <span>Free shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiRefreshCw />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiShield />
                  <span>2-year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mt-8 overflow-hidden">
          <div className="border-b flex gap-4 md:gap-8 px-4 md:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "description"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "specifications"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews (128)
            </button>
          </div>
          
          <div className="p-4 md:p-6">
            {activeTab === "description" && (
              <p className="text-gray-600">{product.description || "No description available."}</p>
            )}
            {activeTab === "specifications" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row py-2 border-b">
                  <span className="sm:w-32 font-medium text-gray-700">Brand</span>
                  <span className="text-gray-600">{product.brand_id?.name || "Generic"}</span>
                </div>
                <div className="flex flex-col sm:flex-row py-2 border-b">
                  <span className="sm:w-32 font-medium text-gray-700">Category</span>
                  <span className="text-gray-600">{product.category_id?.name || "Uncategorized"}</span>
                </div>
                <div className="flex flex-col sm:flex-row py-2 border-b">
                  <span className="sm:w-32 font-medium text-gray-700">SKU</span>
                  <span className="text-gray-600">{product._id?.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-8 text-gray-500">No reviews yet.</div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 1 && (
          <div className="mt-12">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.filter(p => p._id !== product._id).slice(0, 5).map((item) => (
                <Link key={item._id} href={`/product/${item.slug || item._id}`} className="group">
                  <div className="bg-white rounded-xl p-3 hover:shadow-lg transition">
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center h-28 md:h-32">
                      <img
                        src={getMainImageUrl(item.thumbnail)}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-gray-800 mt-2 line-clamp-2 text-xs md:text-sm group-hover:text-teal-600">
                      {item.name}
                    </h3>
                    <div className="mt-2">
                      <span className="font-bold text-teal-600 text-sm md:text-base">
                        {formatPrice(item.final_price)}
                      </span>
                      {item.discount_price > 0 && (
                        <span className="text-xs text-gray-400 line-through ml-2">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.filter(item => item._id !== product._id).length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyViewed.filter(item => item._id !== product._id).slice(0, 5).map((item) => (
                <Link key={item._id} href={`/product/${item.slug || item._id}`} className="group">
                  <div className="bg-white rounded-xl p-3 hover:shadow-lg transition">
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center h-28 md:h-32">
                      <img
                        src={getMainImageUrl(item.thumbnail)}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-gray-800 mt-2 line-clamp-2 text-xs md:text-sm group-hover:text-teal-600">
                      {item.name}
                    </h3>
                    <div className="mt-2">
                      <span className="font-bold text-teal-600 text-sm md:text-base">
                        {formatPrice(item.final_price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}