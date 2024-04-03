import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToken } from "../../hooks/useToken";

function RedirectToLoginIfLoggedOut() {
	const token = useToken();
	const navigate = useNavigate();
	const location = useLocation();

	const publicPaths = ["/login", "/Register"];

	useEffect(() => {
		console.log("Current Path:", location.pathname); // Controlla il percorso attuale
		console.log("Token:", token); // Controlla il valore del token
		console.log("Public Paths:", publicPaths); // Mostra i percorsi pubblici

		// Se non c'è token e non siamo già su una pagina pubblica, reindirizza a /login
		if (!token && !publicPaths.includes(location.pathname)) {
			console.log("Redirecting to login..."); // Conferma che sta reindirizzando
			navigate("/login");
		} else {
			console.log("No redirect needed."); // Conferma che non è necessario reindirizzare
		}
	}, [token, navigate, location.pathname]);

	return null;
}

export default RedirectToLoginIfLoggedOut;
