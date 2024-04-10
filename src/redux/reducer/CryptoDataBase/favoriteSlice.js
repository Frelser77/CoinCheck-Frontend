import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../back/interceptor";
import { Url } from "../../../Config/config";

// Carica le preferenze dell'utente dal server
export const loadUserPreferences = createAsyncThunk("favorites/loadUserPreferences", async (userId, thunkAPI) => {
	try {
		const response = await fetchWithAuth(`${Url}Criptovalute/preferenzeUtente/${userId}`, {
			headers: { "Content-Type": "application/json" },
		});
		if (response.ok) {
			const userPreferences = await response.json();
			return userPreferences;
		} else {
			const errorData = await response.json();
			return thunkAPI.rejectWithValue(errorData.message);
		}
	} catch (error) {
		return thunkAPI.rejectWithValue(error.message);
	}
});

// Aggiunge o rimuove una preferenza
export const toggleUserPreference = createAsyncThunk(
	"favorites/toggleUserPreference",
	async ({ userId, criptoName }, thunkAPI) => {
		try {
			const responseId = await fetchWithAuth(`${Url}Criptovalute/GetCriptoIdByName/${criptoName}`, {
				headers: { "Content-Type": "application/json" },
			});
			if (!responseId.ok) {
				const errorData = await responseId.json();
				return thunkAPI.rejectWithValue(errorData.message);
			}
			const criptoId = await responseId.json();

			const payload = { UserId: userId, CriptoId: criptoId };

			const response = await fetchWithAuth(`${Url}Criptovalute/togglePreferenza`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(errorData.message);
			}
			const responseData = await response.json();
			return responseData; // Questa risposta viene poi gestita da extraReducers
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

// Il tuo slice di Redux per gestire le preferenze
export const favoritesSlice = createSlice({
	name: "favorites",
	initialState: {
		userPreferences: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadUserPreferences.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loadUserPreferences.fulfilled, (state, action) => {
				state.loading = false;
				state.userPreferences = action.payload;
			})
			.addCase(loadUserPreferences.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(toggleUserPreference.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(toggleUserPreference.fulfilled, (state, action) => {
				state.loading = false;
				// Aggiorna il tuo stato basato sulla risposta 'action' dal backend
				const { action: actionType, criptoId, userId } = action.payload;
				if (actionType === "added") {
					state.userPreferences.push({ UserId: userId, CriptoId: criptoId });
				} else if (actionType === "removed") {
					state.userPreferences = state.userPreferences.filter(
						(pref) => pref.UserId !== userId || pref.CriptoId !== criptoId
					);
				}
			})
			.addCase(toggleUserPreference.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default favoritesSlice.reducer;
