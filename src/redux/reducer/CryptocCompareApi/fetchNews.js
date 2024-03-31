import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Endpoint e chiave API per l'accesso alle notizie sulle criptovalute
const BASE_URL = "https://min-api.cryptocompare.com/data/v2/news/";
const API_KEY = "7dca34f837456b42d8d395a93c9cd5076ba8a254eb401f3289172723050159df";

// Creazione di un async thunk per il fetching delle notizie
export const fetchCryptoNews = createAsyncThunk("cryptoNews/fetchCryptoNews", async (_, { rejectWithValue }) => {
	try {
		const response = await fetch(`${BASE_URL}?lang=EN&api_key=${API_KEY}`);
		if (!response.ok) {
			throw new Error("Non è stato possibile ottenere le notizie sulle criptovalute");
		}
		const news = await response.json();
		return news.Data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Stato iniziale dello slice
const initialState = {
	news: [],
	loading: false,
	error: null,
};

// Creazione dello slice per le notizie sulle criptovalute
const cryptoNewsSlice = createSlice({
	name: "cryptoNews",
	initialState,
	reducers: {
		resetCryptoNewsState: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCryptoNews.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCryptoNews.fulfilled, (state, action) => {
				state.loading = false;
				state.news = action.payload; // Salviamo il payload in 'news' anziché 'data'
			})
			.addCase(fetchCryptoNews.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Si è verificato un errore";
			});
	},
});

export const { resetCryptoNewsState } = cryptoNewsSlice.actions;

export default cryptoNewsSlice.reducer;
