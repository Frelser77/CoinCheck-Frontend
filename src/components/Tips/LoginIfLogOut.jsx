import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function RedirectToLoginIfLoggedOut() {
	const token = useSelector((state) => state.login.token);
	const navigate = useNavigate();
	const location = useLocation();

	const publicPaths = ["/login", "/register"]; // Aggiungere qui altri path pubblici

	useEffect(() => {
		// Se non c'è token e non siamo già su una pagina pubblica, reindirizza a /login
		if (!token && !publicPaths.includes(location.pathname)) {
			navigate("/login");
		}
	}, [token, navigate, location.pathname]);

	return null;
}

export default RedirectToLoginIfLoggedOut;
