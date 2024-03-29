// hooks/useAdminAuth.js
import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "../components/Auth/authService"; // Assicurati che il percorso sia corretto

const useAdminAuth = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const verifyAdmin = async () => {
			setIsLoading(true);
			const isAuthenticatedAsAdmin = await isAdminAuthenticated();
			setIsAdmin(isAuthenticatedAsAdmin);
			setIsLoading(false);
		};

		verifyAdmin();
	}, []);

	return { isAdmin, isLoading };
};

export default useAdminAuth;
