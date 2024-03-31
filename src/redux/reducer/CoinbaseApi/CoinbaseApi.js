import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Definisci l'endpoint base per le tue chiamate API
const BASE_URL = "https://api.exchange.coinbase.com/";
// AsyncThunk per ottenere tutte le criptovalute
export const fetchAllCoins = createAsyncThunk("coinbase/fetchAllCoins", async (_, { rejectWithValue }) => {
	try {
		const response = await fetch(`${BASE_URL}products`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		let coins = await response.json();
		return coins; // Restituisci tutte le monete
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// AsyncThunk per ottenere informazioni su un singolo prodotto
// export const fetchSingleProductInfo = createAsyncThunk(
// 	"coinbase/fetchSingleProductInfo",
// 	async ({ product_id }, { rejectWithValue }) => {
// 		try {
// 			const response = await fetch(`${BASE_URL}products/${product_id}`);
// 			if (!response.ok) {
// 				throw new Error("Non è stato possibile ottenere le informazioni del prodotto");
// 			}
// 			const data = await response.json();
// 			return data;
// 		} catch (error) {
// 			return rejectWithValue(error.message);
// 		}
// 	}
// );

// AsyncThunk per ottenere le statistiche per un singolo prodotto
export const fetchCoinStats = createAsyncThunk("coinbase/fetchCoinStats", async (product_id, { rejectWithValue }) => {
	try {
		const response = await fetch(`${BASE_URL}products/${product_id}/stats`);
		if (!response.ok) {
			throw new Error(`Non è stato possibile ottenere le statistiche per ${product_id}`);
		}
		const stats = await response.json();
		return { product_id, stats };
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// AsyncThunk per ottenere il sommario dei volumi
// export const fetchVolumeSummary = createAsyncThunk("coinbase/fetchVolumeSummary", async (_, { rejectWithValue }) => {
// 	try {
// 		const response = await fetch(`${BASE_URL}products/volume-summary`);
// 		if (!response.ok) {
// 			throw new Error("Non è stato possibile ottenere il sommario dei volumi");
// 		}
// 		const volumeSummary = await response.json();
// 		return volumeSummary;
// 	} catch (error) {
// 		return rejectWithValue(error.message);
// 	}
// });

// AsyncThunk per ottenere il libro ordini per una singola moneta
export const fetchCoinOrderBook = createAsyncThunk(
	"coinbase/fetchProductOrderBook",
	async ({ coinId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${BASE_URL}products/${coinId}/book`);
			if (!response.ok) {
				throw new Error("Non è stato possibile ottenere il libro ordini");
			}
			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// AsyncThunk per ottenere il ticker per una singola moneta
export const fetchCoinTicker = createAsyncThunk(
	"coinbase/fetchProductTicker",
	async ({ coinId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${BASE_URL}products/${coinId}/ticker`);
			if (!response.ok) {
				throw new Error("Non è stato possibile ottenere il ticker del prodotto");
			}
			const data = await response.json();
			return data; // Restituisco la variabile
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// AsyncThunk per ottenere i trades storici per una singola moneta
export const fetchHistoricTrades = createAsyncThunk(
	"coinbase/fetchHistoricTrades",
	async ({ coinId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${BASE_URL}products/${coinId}/trades`);
			if (!response.ok) {
				throw new Error("Non è stato possibile ottenere i trades storici");
			}
			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// AsyncThunk per ottenere le candele per un singolo prodotto
export const fetchProductCandles = createAsyncThunk(
	"coinbase/fetchProductCandles",
	async ({ product_id, start, end, granularity }, { rejectWithValue }) => {
		try {
			const response = await fetch(
				`${BASE_URL}products/${product_id}/candles?start=${start}&end=${end}&granularity=${granularity}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const candles = await response.json();
			return { product_id, candles };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Stato iniziale dello slice
const initialState = {
	coins: [],
	tickers: {},
	coinStats: {},
	productCandles: {},
	orderBooks: {},
	historicTrades: {},
	loading: false,
	error: null,
};

// Crea lo slice
const coinbaseSlice = createSlice({
	name: "coinbase",
	initialState,
	reducers: {
		resetCoinbaseState: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllCoins.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAllCoins.fulfilled, (state, action) => {
				state.loading = false;
				state.coins = action.payload;
			})
			.addCase(fetchAllCoins.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// .addCase(fetchSingleProductInfo.pending, (state) => {
			// 	state.loading = true;
			// 	state.error = null;
			// })
			// .addCase(fetchSingleProductInfo.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	const { product_id } = action.meta.arg;
			// 	state.productInfo[product_id] = action.payload;
			// })
			// .addCase(fetchSingleProductInfo.rejected, (state, action) => {
			// 	state.loading = false;
			// 	const { product_id } = action.meta.arg;
			// 	state.error = action.error.message;
			// 	state.productInfo[product_id] = { error: action.error.message };
			// })
			// .addCase(fetchVolumeSummary.pending, (state) => {
			// 	state.loading = true;
			// 	state.error = null;
			// })
			// .addCase(fetchVolumeSummary.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.volumeSummary = action.payload;
			// })
			// .addCase(fetchVolumeSummary.rejected, (state, action) => {
			// 	state.loading = false;
			// 	state.error = action.payload || action.error.message;
			// })
			.addCase(fetchCoinStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCoinStats.fulfilled, (state, action) => {
				const { product_id, stats } = action.payload;
				state.coinStats[product_id] = stats;
			})
			.addCase(fetchCoinStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.error = action.error.message;
			})
			.addCase(fetchCoinOrderBook.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCoinOrderBook.fulfilled, (state, action) => {
				state.loading = false;
				const coinId = action.meta.arg.coinId;
				state.orderBooks[coinId] = action.payload;
			})
			.addCase(fetchCoinOrderBook.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchCoinTicker.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCoinTicker.fulfilled, (state, action) => {
				state.loading = false;
				const coinId = action.meta.arg.coinId;
				state.tickers[coinId] = action.payload;
			})
			.addCase(fetchCoinTicker.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchHistoricTrades.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchHistoricTrades.fulfilled, (state, action) => {
				state.loading = false;
				const coinId = action.meta.arg.coinId;
				state.historicTrades[coinId] = action.payload;
			})
			.addCase(fetchHistoricTrades.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchProductCandles.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProductCandles.fulfilled, (state, action) => {
				state.loading = false;
				const { product_id, candles } = action.payload;
				state.productCandles[product_id] = candles;
			})
			.addCase(fetchProductCandles.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
			});
	},
});

export const { resetCoinbaseState } = coinbaseSlice.actions;
export default coinbaseSlice.reducer;
