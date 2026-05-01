// redux/reducers/CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {
            // Check if item already exists
            const existingItem = state.items.find(item => item.id === payload.id);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                state.items.push({ ...payload, qty: 1 });
            }
            
            state.original_total = state.items.reduce(
                (acc, item) => acc + (item.original_price * item.qty), 0
            );
            state.final_total = state.items.reduce(
                (acc, item) => acc + (item.final_price * item.qty), 0
            );
            
            localStorage.setItem("cart", JSON.stringify({
                items: state.items,
                original_total: state.original_total,
                final_total: state.final_total
            }));
        },

        emptyCart: (state) => {
            state.items = [];
            state.original_total = 0;
            state.final_total = 0;
            localStorage.removeItem("cart");
        },
        
        changeQtyHandler: (state, { payload }) => {
            const item = state.items.find((i) => i.id === payload.id);
            
            if (item) {
                if (payload.flag === 1) {
                    item.qty += 1;
                } else if (payload.flag === 2) {
                    if (item.qty > 1) {
                        item.qty -= 1;
                    }
                }
            }
            
            state.original_total = state.items.reduce(
                (acc, item) => acc + (item.original_price * item.qty), 0
            );
            state.final_total = state.items.reduce(
                (acc, item) => acc + (item.final_price * item.qty), 0
            );
            
            localStorage.setItem("cart", JSON.stringify({
                items: state.items,
                original_total: state.original_total,
                final_total: state.final_total
            }));
        },

        increaseQty: (state, action) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                item.qty += 1;
            }
            
            state.original_total = state.items.reduce(
                (acc, item) => acc + (item.original_price * item.qty), 0
            );
            state.final_total = state.items.reduce(
                (acc, item) => acc + (item.final_price * item.qty), 0
            );
            
            localStorage.setItem("cart", JSON.stringify({
                items: state.items,
                original_total: state.original_total,
                final_total: state.final_total
            }));
        },

        decreaseQty: (state, action) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item && item.qty > 1) {
                item.qty -= 1;
            }
            
            state.original_total = state.items.reduce(
                (acc, item) => acc + (item.original_price * item.qty), 0
            );
            state.final_total = state.items.reduce(
                (acc, item) => acc + (item.final_price * item.qty), 0
            );
            
            localStorage.setItem("cart", JSON.stringify({
                items: state.items,
                original_total: state.original_total,
                final_total: state.final_total
            }));
        },
        
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            
            state.original_total = state.items.reduce(
                (acc, item) => acc + (item.original_price * item.qty), 0
            );
            state.final_total = state.items.reduce(
                (acc, item) => acc + (item.final_price * item.qty), 0
            );
            
            localStorage.setItem("cart", JSON.stringify({
                items: state.items,
                original_total: state.original_total,
                final_total: state.final_total
            }));
        },

        lsToCart: (state) => {
            const cart = JSON.parse(localStorage.getItem("cart"));
            if (cart && cart.items) {
                state.items = cart.items;
                state.original_total = Number(cart.original_total);
                state.final_total = Number(cart.final_total);
            }
        },
        
        setCart: (state, action) => {
            if (action.payload && Array.isArray(action.payload)) {
                state.items = action.payload.map(item => ({
                    id: item.productId?._id || item.id,
                    name: item.productId?.name || item.name,
                    qty: item.qty,
                    final_price: item.productId?.final_price || item.final_price,
                    original_price: item.productId?.original_price || item.original_price,
                    thumbnail: item.productId?.thumbnail || item.thumbnail,
                    discount_percentage: item.productId?.discount_percentage || item.discount_percentage,
                    stock: item.productId?.stock || item.stock
                }));
                
                state.original_total = state.items.reduce(
                    (acc, item) => acc + (item.original_price * item.qty), 0
                );
                state.final_total = state.items.reduce(
                    (acc, item) => acc + (item.final_price * item.qty), 0
                );
                
                localStorage.setItem("cart", JSON.stringify({
                    items: state.items,
                    original_total: state.original_total,
                    final_total: state.final_total
                }));
            }
        }
    },
})

export const { 
    addToCart, 
    emptyCart, 
    changeQtyHandler, 
    lsToCart, 
    increaseQty, 
    decreaseQty,
    removeItem,
    setCart
} = cartSlice.actions

export default cartSlice.reducer