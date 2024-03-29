// productsSlice.js o un file equivalente
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../back/interceptor"; // Aggiorna questo percorso per puntare al file interceptor corretto
import { Url } from "../../../Config/config";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
	try {
		const response = await fetchWithAuth(`${Url}Abbonamenti`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Thunk per l'aggiornamento di un abbonamento
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, data }, { rejectWithValue }) => {
	try {
		const response = await fetchWithAuth(`${Url}Abbonamenti/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error("Network response was not ok");
		return {};
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Thunk per l'eliminazione di un abbonamento
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
	try {
		const response = await fetchWithAuth(`${Url}Abbonamenti/${id}`, {
			method: "DELETE",
		});
		if (!response.ok) throw new Error("Network response was not ok");
		return id;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

const productsSlice = createSlice({
	name: "products",
	initialState: {
		products: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(updateProduct.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.products.findIndex((product) => product.idprodotto === action.payload.idprodotto);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(deleteProduct.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.products = state.products.filter((product) => product.idprodotto !== action.payload);
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default productsSlice.reducer;
