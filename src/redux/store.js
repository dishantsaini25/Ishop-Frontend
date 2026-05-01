import { configureStore } from "@reduxjs/toolkit";
import  cartSlice  from './reducers/CartSlice'


export const store = configureStore({
      reducer: {
        cart: cartSlice
    },
})