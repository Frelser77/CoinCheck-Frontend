import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToken } from "../../hooks/useToken";

function RedirectToLoginIfLoggedOut() {
	const token = useToken();
	const navigate = useNavigate();
	const location = useLocation();

	const publicPaths = ["/login", "/Register"];

	useEffect(() => {
		// Se non c'è token e non siamo già su una pagina pubblica, reindirizza a /login
		if (!token && !publicPaths.includes(location.pathname)) {
			navigate("/login");
		} else {
			console.log("No redirect needed.");
		}
	}, [token, navigate, location.pathname]);

	return null;
}

export default RedirectToLoginIfLoggedOut;
