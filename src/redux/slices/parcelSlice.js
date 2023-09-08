import { createSlice } from '@reduxjs/toolkit';
import { logOut } from './userSlice';

const initialState = {
  parcels: null,
  loading: false,
  error: null,
};

export const parcelsSlice = createSlice({
  name: 'parcels',
  initialState,
  reducers: {
    fetchParcelsStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    fetchParcelsSuccess: (state, action) => {
      state.loading = false;
      state.parcels = action.payload;
      state.error = false;
    },
    fetchParcelsFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOut, (state) => {
      state.parcels = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { fetchParcelsStart, fetchParcelsSuccess, fetchParcelsFailure } =
  parcelsSlice.actions;

export default parcelsSlice.reducer;