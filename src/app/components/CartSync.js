// components/CartSync.js
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../helper/helper';
import { setCart, emptyCart } from '../redux/reducers/CartSlice';

export default function CartSync({ user }) {
    const dispatch = useDispatch();
    const cart = useSelector((store) => store.cart);

    // ✅ Jab user login kare, backend se cart load karo
    useEffect(() => {
        const loadCartFromBackend = async () => {
            if (!user?._id) return;
            
            try {
                console.log("Loading cart from backend for user:", user._id);
                const response = await axiosInstance.get(`/cart/get/${user._id}`);
                
                if (response.data.success && response.data.data.cart?.length > 0) {
                    console.log("Cart found in backend:", response.data.data.cart.length, "items");
                    dispatch(setCart(response.data.data.cart));
                } else {
                    console.log("No cart in backend, checking localStorage...");
                    // Agar backend mein cart nahi hai, toh localStorage se backend mein save karo
                    const localCart = JSON.parse(localStorage.getItem("cart"));
                    if (localCart && localCart.items && localCart.items.length > 0) {
                        console.log("Syncing localStorage cart to backend...");
                        await axiosInstance.post("/cart/sync", {
                            user_id: user._id,
                            cart: localCart.items.map(item => ({
                                id: item.id,
                                qty: item.qty
                            }))
                        });
                    }
                }
            } catch (error) {
                console.error("Load cart error:", error);
            }
        };
        
        loadCartFromBackend();
    }, [user?._id]);

    // ✅ Jab cart change ho, backend mein sync karo
    useEffect(() => {
        const syncCartToBackend = async () => {
            if (!user?._id) return;
            if (!cart.items || cart.items.length === 0) return;
            
            try {
                console.log("Syncing cart to backend...", cart.items.length, "items");
                const response = await axiosInstance.post("/cart/sync", {
                    user_id: user._id,
                    cart: cart.items.map(item => ({
                        id: item.id,
                        qty: item.qty
                    }))
                });
                
                if (response.data.success) {
                    console.log("Cart synced successfully!");
                }
            } catch (error) {
                console.error("Cart sync error:", error);
            }
        };
        
        // 1 second ka delay taaki baar baar API call na ho
        const timeoutId = setTimeout(() => {
            if (cart.items.length > 0) {
                syncCartToBackend();
            }
        }, 1000);
        
        return () => clearTimeout(timeoutId);
        
    }, [cart.items, user?._id]);

    return null; // Yeh component kuch render nahi karta
}