import { loginUser } from "../features/auth/authSlice";
import { Url } from "../../../Config/config";

export const fetchTokenAndLogin = (loginDto) => async (dispatch) => {
	try {
		const response = await fetch(`${Url}Account/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginDto),
		});

		if (response.ok) {
			const { token } = await response.json();
			// Qui dovresti recuperare anche le informazioni dell'utente se necessario
			dispatch(loginUser({ token })); // Aggiornato per inviare solo il token
		} else {
			throw new Error("Errore nel recupero del token");
		}
	} catch (error) {
		console.error("Errore nel fetch:", error);
	}
};
