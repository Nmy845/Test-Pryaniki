import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
    reducer: {
        auth: loginReducer,
        data: dataReducer,
    },
});

export default store;