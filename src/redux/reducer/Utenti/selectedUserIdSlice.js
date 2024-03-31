import { createSlice } from "@reduxjs/toolkit";

export const selectedUserIdSlice = createSlice({
	name: "selectedUserId",
	initialState: {
		id: null,
	},
	reducers: {
		setSelectedUserId: (state, action) => {
			state.id = action.payload;
		},
		clearSelectedUserId: (state) => {
			state.id = null;
		},
	},
});

export const { setSelectedUserId, clearSelectedUserId } = selectedUserIdSlice.actions;

export default selectedUserIdSlice.reducer;
