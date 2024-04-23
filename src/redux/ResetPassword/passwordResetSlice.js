import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Url } from "../../Config/config";

export const sendPasswordResetRequest = createAsyncThunk(
	"passwordReset/sendRequest",
	async (email, { rejectWithValue }) => {
		try {
			const response = await fetch(`${Url}ResetPassword/passwordResetRequest`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Network response was not ok");
			}

			if (!data.success) {
				// Assicurati che sia tutto minuscolo
				throw new Error(data.message || "Operation failed without a specific message");
			}

			return data.message;
		} catch (err) {
			return rejectWithValue(err.message);
		}
	}
);

// Thunk per effettuare il reset della password
export const resetPassword = createAsyncThunk(
	"passwordReset/reset",
	async ({ token, userId, newPassword }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${Url}ResetPassword/resetPassword`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					userId,
					newPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.Message || "Errore di rete.");
			}

			return data.Message;
		} catch (err) {
			return rejectWithValue(err.message);
		}
	}
);

const passwordResetSlice = createSlice({
	name: "passwordReset",
	initialState: {
		loading: false,
		error: null,
		message: "",
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(sendPasswordResetRequest.pending, (state) => {
				state.loading = true;
			})
			.addCase(sendPasswordResetRequest.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload;
			})
			.addCase(sendPasswordResetRequest.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(resetPassword.pending, (state) => {
				state.loading = true;
			})
			.addCase(resetPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default passwordResetSlice.reducer;
