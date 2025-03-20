import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import authReducer from './AuthSlice';
import jobReducer from './JobSlice';
const store = configureStore({
    reducer: {
        users: userReducer,
        auth: authReducer,
        jobs: jobReducer
    }
});
export default store;