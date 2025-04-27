import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import portfolioReducer from "./slices/portfolioSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        portfolioListings: portfolioReducer
    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
