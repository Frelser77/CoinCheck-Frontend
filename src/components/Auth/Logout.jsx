import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/loginUser"; // Assicurati che il percorso sia corretto
import { persistor } from "../../redux/store/store"; // Assicurati che il percorso sia corretto
import { useNavigate } from "react-router-dom";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Il tuo componente LogoutButton

const LogoutButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.login?.user);

	const handleLogout = async () => {
		// Esegue il logout sul frontend
		dispatch(logout());

		// Cancella lo stato persistente dal local storage
		await persistor.purge();

		navigate("/login");
	};

	return (
		<button onClick={handleLogout} className="nav-item flex-center nav-link">
			<FontAwesomeIcon icon={faSignOutAlt} />
			<span className="nav-text ms-1">Logout</span>
		</button>
	);
};

export default LogoutButton;
{
	/* <NavLink className="nav-link">{user && <h5 className="p-0 m-0">Bentornato, {user.username}!</h5>}</NavLink>
{user && <h5 className="p-0 m-0">Bentornato, {user.username} */
}
