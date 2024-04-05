import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Url } from "../../Config/config";

// Thunk per la registrazione
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
	try {
		const response = await fetch(`${Url}Account/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			throw new Error("Registration failed!");
		}

		const data = await response.json();
		return { user: data.user, token: data.token }; // Adatta questa riga ai dati che il tuo backend invia
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Thunk per il login
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
	try {
		const response = await fetch(`${Url}Account/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || "Login failed!");
		}

		const data = await response.json();
		return { user: data.user, token: data.token };
	} catch (error) {
		return rejectWithValue(error.toString());
	}
});

// Inizializzazione dello stato
const initialState = {
	user: null,
	token: "", // Inizializzato vuoto, sarà impostato dopo il login
	isLoading: false,
	isError: false,
	errorMessage: "",
	loginSuccess: false,
	loginAttempted: false,
};
// Auth slice
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Azione esplicita di logout
		logout: (state) => {
			// Resetta lo stato all'inizializzazione
			Object.assign(state, initialState);
			//altre azioni, come navigare l'utente alla pagina di autenticazione
		},
		resetAuthState: (state) => {
			state.isError = false;
			state.errorMessage = "";
			state.registrationSuccess = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
				state.loginSuccess = true;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.error.message;
				state.loginSuccess = false;
			})
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
				state.registrationSuccess = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.error.message;
				state.registrationSuccess = false; // Aggiungi per indicare il fallimento della registrazione
			});
	},
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
// export const selectUserRole = (state) => (state.login.user ? state.login.user.ruolo : null);
