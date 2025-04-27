import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthUser } from "@src/utils";

const userFromStorage = getAuthUser();

const initialState = userFromStorage || null;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess: (_state, action: PayloadAction) => (action.payload),
        logout: () => null,
        updateUserInfo: (state, action: PayloadAction) => {
            if (state) Object.assign(state, action.payload);
        },
    },
});

export const { loginSuccess, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;

