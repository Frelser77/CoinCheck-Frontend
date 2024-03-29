import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Assicurati che l'importazione sia senza parentesi graffe e usa jwt_decode

const useUserRole = () => {
	const token = useSelector((state) => state.login.token);
	const [role, setRole] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true; // Questa variabile ti aiuterà a gestire il cleanup dell'effect
		if (token) {
			try {
				const decodedToken = jwtDecode(token); // Usa il nome corretto della funzione qui
				if (isMounted) {
					setRole(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
				}
			} catch (error) {
				if (isMounted) {
					console.error("Errore nella decodifica del token:", error);
					setRole("");
				}
			} finally {
				if (isMounted) {
					setIsLoading(false); // Imposta il caricamento su false dopo il tentativo di decodifica
				}
			}
		} else {
			setIsLoading(false); // Se non c'è token, non c'è caricamento da fare
		}
		// Quando il componente viene smontato, imposta isMounted su false
		return () => {
			isMounted = false;
		};
	}, [token]);

	return { role, isLoading };
};

export default useUserRole;
