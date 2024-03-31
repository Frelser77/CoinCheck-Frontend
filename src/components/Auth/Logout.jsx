import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducer/loginUser"; // Assicurati che il percorso sia corretto
import { persistor } from "../../redux/store/store"; // Assicurati che il percorso sia corretto
import { useNavigate } from "react-router-dom";

// Il tuo componente LogoutButton

const LogoutButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = async () => {
		// Esegue il logout sul frontend
		dispatch(logout());

		// Cancella lo stato persistente dal local storage
		await persistor.purge();

		navigate("/login");
	};

	return (
		<button onClick={handleLogout} className="btn btn-outline-danger">
			Logout
		</button>
	);
};

export default LogoutButton;
