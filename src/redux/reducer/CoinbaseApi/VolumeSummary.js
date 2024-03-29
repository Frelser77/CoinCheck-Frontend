// volumeSummarySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://api.exchange.coinbase.com/";

export const fetchVolumeSummary = createAsyncThunk(
	"volumeSummary/fetchVolumeSummary",
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch(`${BASE_URL}products/volume-summary`);
			if (!response.ok) {
				throw new Error("Non è stato possibile ottenere il sommario dei volumi");
			}
			const volumeSummary = await response.json();
			return volumeSummary;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	data: [],
	loading: false,
	error: null,
};

const volumeSummarySlice = createSlice({
	name: "volumeSummary",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchVolumeSummary.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchVolumeSummary.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchVolumeSummary.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
			});
	},
});

export default volumeSummarySlice.reducer;
