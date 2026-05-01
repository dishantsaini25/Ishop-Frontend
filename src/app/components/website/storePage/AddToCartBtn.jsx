'use client'

import { addToCart, changeQtyHandler, removeItem } from '@/redux/reducers/CartSlice';
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../../../../../helper/helper';

export default function AddToCartButton(props) {
    console.log(props, "props");
    
    const cart = useSelector((store) => store.cart);
    const cartItem = cart.items.find((item) => item.id === props.id);
    const dispatch = useDispatch(); // ✅ FIX: dispacher -> dispatch

    async function cartHandler() {
        // ✅ FIX: props.user check karo
        if (props.user && props.user._id) {
            try {
                const response = await axiosInstance.post("cart/add-to-cart", { 
                    user_id: props.user._id,  // ✅ FIX: user._id
                    productId: props._id 
                });
                console.log("Cart API Response:", response.data);
            } catch (error) {
                console.error("Cart API Error:", error);
            }
        }

        // ✅ FIX: addToCart mein sahi data bhejo
        dispatch(addToCart({ 
            id: props.id,
            name: props.name,
            original_price: props.original_price,
            final_price: props.final_price,
            thumbnail: props.thumbnail,
            discount_percentage: props.discount_percentage,
            stock: props.stock
        }));
    }

    async function qtyHandler(id, flag) {
        // ✅ FIX: props.user check
        if (props.user && props.user._id) {
            try {
                const response = await axiosInstance.post("cart/add-to-cart", { 
                    user_id: props.user._id, 
                    productId: props._id, 
                    flag 
                });
                console.log("Qty Update Response:", response.data);
            } catch (error) {
                console.error("Qty Update Error:", error);
            }
        }
        
        // ✅ FIX: changeQtyHandler mein sahi data bhejo
        dispatch(changeQtyHandler({ 
            id: props.id, 
            flag: flag 
        }));
    }

    async function removeItemHandler() {
        // ✅ FIX: Remove from backend
        if (props.user && props.user._id) {
            try {
                const response = await axiosInstance.post("cart/remove", { 
                    user_id: props.user._id, 
                    productId: props._id 
                });
                console.log("Remove Response:", response.data);
            } catch (error) {
                console.error("Remove Error:", error);
            }
        }
        
        // Remove from Redux
        dispatch(removeItem(props.id));
    }

    return (
        <div className="p-3 pt-0">
            {
                cartItem != null ?
                    <div className="flex flex-col gap-2">
                        {/* QTY ROW */}
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => qtyHandler(props.id, 2)}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                -
                            </button>
                            <span>{cartItem.qty}</span>
                            <button
                                onClick={() => qtyHandler(props.id, 1)}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                +
                            </button>
                        </div>

                        {/* REMOVE BUTTON BELOW */}
                        <button
                            onClick={removeItemHandler}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                        >
                            Remove Item
                        </button>
                    </div>
                    :
                    <button
                        onClick={cartHandler}
                        disabled={!props.stock}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition
                        ${props.stock
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        {props.stock ? "Add To Cart" : "Unavailable"}
                    </button>
            }
        </div>
    )
}