import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Url } from "../../../Config/config";
import fetchWithAuth from "../back/interceptor";

// AsyncThunk per recuperare tutti i post
export const fetchAllPosts = createAsyncThunk(
	"posts/fetchAll",
	async ({ pageIndex, pageSize }, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const url = new URL(`${Url}posts/all`);
			url.search = new URLSearchParams({ pageIndex, pageSize });

			const response = await fetchWithAuth(url, {
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
	}
);

// Thunk per creare un post
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

export const editPost = createAsyncThunk(
	"posts/editPost",
	async ({ postId, formData }, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const response = await fetchWithAuth(`${Url}posts/edit/post/${postId}`, {
				method: "PUT",
				body: formData, // Assumi che formData contenga il titolo, il contenuto e/o il file
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to edit post.");
			}

			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const editComment = createAsyncThunk(
	"posts/editComment",
	async ({ commentId, content }, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const response = await fetchWithAuth(`${Url}posts/edit/comment/${commentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ content }),
			});

			if (!response.ok) {
				throw new Error("Failed to edit comment.");
			}

			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const softDeletePost = createAsyncThunk(
	"posts/softDeletePost",
	async (postId, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const response = await fetchWithAuth(`${Url}posts/delete/post/${postId}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete post.");
			}

			return postId; // Ritorna l'ID del post per identificarlo nello stato
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const softDeleteComment = createAsyncThunk(
	"posts/softDeleteComment",
	async (commentId, { getState, rejectWithValue }) => {
		try {
			const token = getState().login.token;
			const response = await fetchWithAuth(`${Url}posts/delete/comment/${commentId}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete comment.");
			}

			return commentId; // Ritorna l'ID del commento per identificarlo nello stato
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Inizializza lo stato iniziale
const initialState = {
	posts: [],
	isLoading: false,
	isLikingPost: false,
	isLikingComment: false,
	likingPostId: null,
	isError: false,
	errorMessage: "",
	pageIndex: 0,
	hasMore: true,
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
				const newPostWithUserDetails = {
					...action.payload, // Questo contiene il nuovo post con i dettagli dell'utente
					userRole: action.payload.userRole, // Aggiungi questa riga se userRole non è già nel payload
					// Assicurati che l'oggetto action.payload abbia tutte le informazioni dell'utente
				};
				state.posts.unshift(newPostWithUserDetails); // Aggiungi il nuovo post all'inizio dell'array
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
				// Trova il post a cui il commento appartiene
				const postIndex = state.posts.findIndex((post) => post.postId === action.meta.arg.postId);
				if (postIndex !== -1) {
					// Aggiungi il commento all'array di commenti di quel post
					state.posts[postIndex].comments.push(action.payload);
				}
			})
			.addCase(commentOnPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(toggleLikePost.pending, (state, action) => {
				state.likingPostId = action.meta.arg.postId; // Imposta l'ID del post che sta aggiornando i like
			})
			.addCase(toggleLikePost.fulfilled, (state, action) => {
				// Aggiorna solo il post specifico che ha cambiato lo stato di like
				const postIndex = state.posts.findIndex((post) => post.postId === action.meta.arg.postId);
				if (postIndex !== -1) {
					state.posts[postIndex].likeCount = action.payload.likeCount;
					state.posts[postIndex].likes = action.payload.likesDetails;
				}
				state.likingPostId = null; // Azione completata, resetta l'ID
			})
			.addCase(toggleLikePost.rejected, (state, action) => {
				state.likingPostId = null; // Azione fallita, resetta l'ID
			})
			.addCase(toggleLikeComment.pending, (state) => {
				state.isLikingComment = true;
			})
			.addCase(toggleLikeComment.fulfilled, (state, action) => {
				const { commentId, likesCount } = action.payload;
				let updated = false;

				// Trova e aggiorna il commento specifico con i nuovi dati di like
				state.posts.forEach((post) => {
					const commentIndex = post.comments.findIndex((comment) => comment.commentId === commentId);
					if (commentIndex !== -1) {
						post.comments[commentIndex].likeCount = likesCount;
						// Gestisci anche l'aggiornamento dei dettagli di chi ha messo like, se necessario
						post.comments[commentIndex].likes = action.payload.likesDetails;
						updated = true;
					}
				});

				if (updated) {
					state.isLikingComment = false;
				}
			})
			.addCase(toggleLikeComment.rejected, (state, action) => {
				state.isLikingComment = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(fetchAllPosts.fulfilled, (state, action) => {
				const { posts, total } = action.payload; // Nota la minuscola "p" e "t"
				if (posts.length === 0) {
					state.hasMore = false;
				} else {
					state.pageIndex += 1;
					state.posts = [...state.posts, ...posts]; // Concatena i nuovi post a quelli esistenti
				}
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
			})
			.addCase(editPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isError = false;
				const index = state.posts.findIndex((post) => post.postId === action.payload.postId);
				if (index !== -1) {
					state.posts[index] = action.payload;
				}
			})
			.addCase(editPost.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
			})
			.addCase(editPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.error.message;
			})
			.addCase(softDeletePost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(softDeletePost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.posts = state.posts.filter((post) => post.postId !== action.payload);
			})
			.addCase(softDeletePost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.error.message;
			})
			.addCase(softDeleteComment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(softDeleteComment.fulfilled, (state, action) => {
				state.isLoading = false;
				const commentId = action.payload; // action.payload qui è commentId
				state.posts.forEach((post) => {
					post.comments = post.comments.filter((comment) => comment.commentId !== commentId);
				});
			})
			.addCase(softDeleteComment.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.error.message;
			})
			.addCase(editComment.fulfilled, (state, action) => {
				// Assicurati che action.payload contenga postId e commentId come previsto
				const { postId, commentId } = action.payload;

				// Trova il post a cui il commento appartiene
				const postIndex = state.posts.findIndex((post) => post.postId === postId);
				if (postIndex !== -1) {
					// Trova e aggiorna il commento all'interno di quel post
					const commentIndex = state.posts[postIndex].comments.findIndex((comment) => comment.commentId === commentId);
					if (commentIndex !== -1) {
						state.posts[postIndex].comments[commentIndex] = action.payload; // Aggiorna il commento con i dati restituiti dall'API
					}
				}
			});
	},
});

// Esporta le azioni e il reducer
export const { resetPostsState, updatePost, removePost, updateComment, removeComment } = postsSlice.actions;
export default postsSlice.reducer;
