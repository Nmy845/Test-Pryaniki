import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../services/api';
import { saveToken, getToken, removeToken } from '../../utils/storage/localStorage';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (credentials) => {
    const response = await login(credentials);
    if (response.data && response.data.token) {
        return response.data.token;
    } else {
        throw new Error('Логин или пароль не верен');
    }
});


const loginSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getToken() || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            saveToken(null);
            removeToken();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                saveToken(action.payload);
            })
            .addCase(fetchAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;
