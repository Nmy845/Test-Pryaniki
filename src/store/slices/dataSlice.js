import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, createData, updateData, deleteData } from '../../services/api';

export const fetchTableData = createAsyncThunk('data/fetchTableData', async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await fetchData(token);
    return response.data;
});

export const createNewRecord = createAsyncThunk('data/createNewRecord', async (newRecord, { getState }) => {
    const { token } = getState().auth;
    console.log('Creating new record with data:', newRecord);  // Логирование данных
    const response = await createData(token, newRecord);
    return response.data;
});

export const updateRecord = createAsyncThunk('data/updateRecord', async ({ id, updatedRecord }, { getState }) => {
    const { token } = getState().auth;
    console.log('Update Record Params:', { id, updatedRecord });  // Логирование параметров
    const response = await updateData(token, id, updatedRecord);
    return response.data;
});

export const deleteRecord = createAsyncThunk('data/deleteRecord', async (id, { getState }) => {
    const { token } = getState().auth;
    await deleteData(token, id);
    return id;
});

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        records: [],
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTableData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTableData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(fetchTableData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createNewRecord.fulfilled, (state, action) => {
                state.records.push(action.payload);
            })
            .addCase(updateRecord.fulfilled, (state, action) => {
                const index = state.records.findIndex(record => record.id === action.payload.id);
                if (index !== -1) {
                    state.records[index] = action.payload;
                }
            })
            .addCase(deleteRecord.fulfilled, (state, action) => {
                state.records = state.records.filter(record => record.id !== action.payload);
            });
    },
});

export default dataSlice.reducer;
