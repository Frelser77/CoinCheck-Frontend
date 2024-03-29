// interceptor.js
import { store } from "../../store/store";

async function fetchWithAuth(url, options = {}) {
	const state = store.getState();
	const token = state.login.token;

	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};

	const response = await fetch(url, { ...options, headers });
	return response;
}

export default fetchWithAuth;
