import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null
}

const AuthSlice = createSlice({
    name: "auth slice",
    initialState,
    reducers:{
        userLogin: (state,action) =>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        }
    }
})

export const {userLogin} = AuthSlice.actions;
export default AuthSlice.reducer;
