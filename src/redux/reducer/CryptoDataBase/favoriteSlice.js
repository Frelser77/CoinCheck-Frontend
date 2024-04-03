import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../back/interceptor"; // Aggiusta il percorso se necessario
import { Url } from "../../../Config/config";

export const loadUserPreferences = createAsyncThunk("favorites/loadUserPreferences", async (userId, thunkAPI) => {
	try {
		const response = await fetchWithAuth(`${Url}Criptovalute/preferenzeUtente/${userId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const userPreferences = await response.json();
			console.log("userPreferences", userPreferences);
			return userPreferences;
		} else {
			const errorData = await response.json();
			return thunkAPI.rejectWithValue(errorData.message);
		}
	} catch (error) {
		return thunkAPI.rejectWithValue(error.message);
	}
});

export const toggleUserPreference = createAsyncThunk(
	"favorites/toggleUserPreference",
	async ({ userId, criptoName }, thunkAPI) => {
		try {
			// Prima ottieni l'ID della criptovaluta dal suo nome
			const responseId = await fetchWithAuth(`${Url}Criptovalute/GetCriptoIdByName/${criptoName}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!responseId.ok) {
				const errorData = await responseId.json();
				return thunkAPI.rejectWithValue(errorData.message);
			}
			const criptoId = await responseId.json();
			// console.log("criptoId", criptoId);

			// Ora che hai l'ID, puoi costruire il payload per la preferenza
			const payload = {
				UserId: userId,
				CriptoId: criptoId,
			};

			// console.log("payload", payload);
			// E ora invii la tua richiesta POST a togglePreferenza
			const response = await fetchWithAuth(`${Url}Criptovalute/togglePreferenza`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (response.ok) {
				// Ottieni le preferenze aggiornate o esegui un'altra azione richiesta
				const updatedPreferences = await response.json();
				return updatedPreferences;
			} else {
				const errorData = await response.json();
				return thunkAPI.rejectWithValue(errorData.message);
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

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
				console.log(state.userPreferences);
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
				const { UserId, CriptoId } = action.payload;
				// Trova la preferenza usando l'ID
				const index = state.userPreferences.findIndex((p) => p.UserId === UserId && p.CriptoId === CriptoId);
				if (index !== -1) {
					// Rimuove la preferenza
					state.userPreferences.splice(index, 1);
				} else {
					// Aggiunge la preferenza
					state.userPreferences.push({ UserId, CriptoId, CriptoNome: coinDetails.name });
				}
			})
			.addCase(toggleUserPreference.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default favoritesSlice.reducer;
