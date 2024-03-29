// authService.js
import fetchWithAuth from "../../redux/reducer/back/interceptor";

const isAdminAuthenticated = async () => {
	try {
		const response = await fetchWithAuth("/admin/verify-admin");

		if (response.ok) {
			// La risposta è OK, quindi l'utente è autenticato come admin
			return true;
		} else {
			// La risposta non è OK, quindi l'utente non è autenticato come admin
			return false;
		}
	} catch (error) {
		console.error("Errore durante la verifica dell'admin: ", error);
		return false; // In caso di errore, considera l'utente non autenticato
	}
};

export { isAdminAuthenticated };
