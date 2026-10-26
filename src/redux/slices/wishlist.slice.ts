import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
    page: number;
}

const initialState: WishlistState = {
    page: 1,
};

const wishlistSlice = createSlice({
    name: "wishlistReducer",
    initialState,
    reducers: {
        setWishlistPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
});


export const { setWishlistPage } = wishlistSlice.actions;
export default wishlistSlice.reducer;