import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../back/interceptor";
import { Url } from "../../../Config/config";

const performFetch = async (url, method, body, token) => {
	const headers = new Headers({
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	});

	const config = {
		method: method,
		headers: headers,
		body: body ? JSON.stringify(body) : null,
	};

	const response = await fetch(url, config);

	if (response.status === 204) {
		return { NoContent: true };
	}

	const text = await response.text();

	// Se il testo non è vuoto, prova a fare il parsing.
	if (text) {
		try {
			const data = JSON.parse(text);
			if (response.ok) {
				return data;
			} else {
				throw new Error(data.message || response.statusText || "An error occurred.");
			}
		} catch (error) {
			// Se il parsing JSON fallisce, ma la risposta è comunque ok, restituisci il testo.
			if (response.ok) {
				return text;
			} else {
				throw new Error(response.statusText || "An error occurred.");
			}
		}
	} else {
		throw new Error("The response from the server was empty.");
	}
};

export const uploadProfileImage = createAsyncThunk(
	"utenti/uploadProfileImage",
	async ({ userId, file }, { getState, rejectWithValue }) => {
		const url = `${Url}Utenti/upload-image/${userId}`;
		let formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetchWithAuth(url, {
				method: "POST",
				body: formData, // Non è necessario specificare i headers qui, l'interceptor si occupa dell'Authorization
			});

			if (!response.ok) {
				throw new Error("Errore durante l'upload dell'immagine.");
			}

			const data = await response.json();
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Fetch all users (GET)
export const fetchUtenti = createAsyncThunk("utenti/fetchUtenti", async (_, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		return await performFetch(`${Url}Utenti`, "GET", null, token);
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Fetch a single user (GET)
export const fetchUtente = createAsyncThunk("utenti/fetchUtente", async (id, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		return await performFetch(`${Url}Utenti/${id}`, "GET", null, token);
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Add a new user (POST)
export const createUser = createAsyncThunk("utenti/createUser", async (userData, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		return await performFetch(`${Url}Utenti`, "POST", userData, token);
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Update a user (PUT)
export const updateUser = createAsyncThunk(
	"utenti/updateUser",
	async ({ id, userData }, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			return await performFetch(`${Url}Utenti/${id}`, "PUT", userData, token);
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Delete a user (DELETE)
// export const deleteUser = createAsyncThunk("utenti/deleteUser", async (id, { getState, rejectWithValue }) => {
// 	try {
// 		const token = getState().auth.token;
// 		return await performFetch(`/api/Utenti/${id}`, "DELETE", null, token);
// 	} catch (error) {
// 		return rejectWithValue(error.message);
// 	}
// });

// Soft delete a user (PATCH)
export const deleteUser = createAsyncThunk("utenti/softDeleteUser", async (id, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		const userData = { isActive: false }; // Dati per l'aggiornamento
		return await performFetch(`${Url}Utenti/${id}`, "PATCH", userData, token);
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Restore a user (PATCH)
export const restoreUser = createAsyncThunk("utenti/restoreUser", async (id, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		const userData = { isActive: true }; // Dati per l'aggiornamento
		return await performFetch(`${Url}Utenti/${id}/restore`, "PATCH", userData, token);
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Aggiungi i casi per softDeleteUser nel tuo slice...

// Slice
const utentiSlice = createSlice({
	name: "utenti",
	initialState: {
		users: [],
		status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
		error: null,
		successMessage: "", // Aggiungi questo per gestire i messaggi di successo
	},
	reducers: {
		clearStatus: (state) => {
			state.status = "idle";
			state.error = null;
			state.successMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUtenti.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchUtenti.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.users = action.payload;
				state.successMessage = "Utenti fetched successfully";
			})
			.addCase(fetchUtenti.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(fetchUtente.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchUtente.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.userDetails = action.payload;
				state.successMessage = "Dettagli utente recuperati con successo";
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.users.push(action.payload);
				state.successMessage = "Utente created successfully";
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				const index = state.users.findIndex((user) => user.id === action.payload.id);
				if (index !== -1) {
					state.users[index] = action.payload;
					state.successMessage = "Utente updated successfully";
				}
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.users = state.users.filter((user) => user.id !== action.meta.arg);
				state.successMessage = "Utente deleted successfully";
			})
			.addCase(fetchUtente.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(createUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { clearStatus } = utentiSlice.actions;
export default utentiSlice.reducer;
