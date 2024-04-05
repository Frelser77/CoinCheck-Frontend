import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../../Config/config";
import fetchWithAuth from "../back/interceptor";

// AsyncThunk per recuperare tutti i post
export const fetchAllPosts = createAsyncThunk("posts/fetchAll", async (_, { getState, rejectWithValue }) => {
	try {
		const state = getState();
		const token = state.login.token;
		const response = await fetchWithAuth(`${Url}posts/all`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch posts.");
		return await response.json();
	} catch (error) {
		return rejectWithValue(error.toString());
	}
});

// Nella tua logica di slice Redux
export const createPost = createAsyncThunk("posts/createPost", async (formData, { getState, rejectWithValue }) => {
	try {
		const token = getState().login.token;
		const response = await fetchWithAuth(`${Url}posts/post`, {
			method: "POST",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok.");
		}

		return await response.json();
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// AsyncThunk per commentare un post
export const commentOnPost = createAsyncThunk(
	"posts/commentOnPost",
	async ({ postId, createCommentDto }, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const response = await fetchWithAuth(`${Url}posts/${postId}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(createCommentDto), // Invia il corpo della richiesta correttamente
			});
			if (!response.ok) throw new Error("Network response was not ok.");
			return await response.json();
		} catch (error) {
			return rejectWithValue(error.toString());
		}
	}
);

// AsyncThunk per mettere/togliere mi piace a un post
export const toggleLikePost = createAsyncThunk(
	"posts/toggleLikePost",
	async ({ postId }, { getState, rejectWithValue }) => {
		try {
			const state = getState();
			const token = state.login.token;
			const response = await fetchWithAuth(`${Url}posts/like/post/${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Network response was not ok.");
			return await response.json();
		} catch (error) {
			return rejectWithValue(error.toString());
		}
	}
);

// AsyncThunk per mettere/togliere mi piace a un commento
export const toggleLikeComment = createAsyncThunk(
	"posts/toggleLikeComment",
	async ({ commentId }, { getState, rejectWithValue }) => {
		try {
			const state = getState();
			const token = state.login.token;
			const response = await fetchWithAuth(`${Url}posts/like/comment/${commentId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Network response was not ok.");
			return await response.json();
		} catch (error) {
			return rejectWithValue(error.toString());
		}
	}
);

// Inizializza lo stato iniziale
const initialState = {
	posts: [],
	comments: [],
	isLoading: false,
	isError: false,
	errorMessage: "",
};

// Crea lo slice
const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		removePost: (state, action) => {
			state.posts = state.posts.filter((post) => post.id !== action.payload);
		},
		updatePost: (state, action) => {
			const index = state.posts.findIndex((post) => post.id === action.payload.id);
			if (index !== -1) {
				state.posts[index] = action.payload;
			}
		},
		// E analogamente per i commenti
		removeComment: (state, action) => {
			state.comments = state.comments.filter((comment) => comment.id !== action.payload);
		},
		updateComment: (state, action) => {
			// Trova il post del commento
			const postIndex = state.posts.findIndex((post) =>
				post.comments.some((comment) => comment.id === action.payload.id)
			);
			if (postIndex !== -1) {
				// Trova l'indice del commento e aggiorna
				const commentIndex = state.posts[postIndex].comments.findIndex((comment) => comment.id === action.payload.id);
				if (commentIndex !== -1) {
					state.posts[postIndex].comments[commentIndex] = action.payload;
				}
			}
		},
		resetPostsState: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createPost.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(createPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
				state.posts.unshift(action.payload); // Aggiunge il nuovo post all'inizio dell'array
			})
			.addCase(createPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(commentOnPost.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(commentOnPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
				state.comments.push(action.payload);
			})
			.addCase(commentOnPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(toggleLikePost.fulfilled, (state, action) => {
				const index = state.posts.findIndex((post) => post.postId === action.meta.arg.postId);
				if (index !== -1) {
					// Aggiorna il conteggio dei mi piace e l'array dei mi piace con le nuove informazioni
					state.posts[index].likeCount = action.payload.likeCount;
				}
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(toggleLikePost.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(toggleLikePost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(toggleLikeComment.fulfilled, (state, action) => {
				const { postId, commentId, likeCount } = action.payload;
				const postToUpdate = state.posts.find((post) => post.postId === postId);
				if (postToUpdate) {
					const commentToUpdate = postToUpdate.comments.find((comment) => comment.commentId === commentId);
					if (commentToUpdate) {
						commentToUpdate.likeCount = likeCount;
					}
				}
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(fetchAllPosts.fulfilled, (state, action) => {
				// Sostituisci i post esistenti con quelli appena recuperati
				state.posts = action.payload;
				state.isLoading = false;
				state.isError = false;
			})
			.addCase(fetchAllPosts.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(fetchAllPosts.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			});
	},
});

// Esporta le azioni e il reducer
export const { resetPostsState, updatePost, removePost, updateComment, removeComment } = postsSlice.actions;
export default postsSlice.reducer;
