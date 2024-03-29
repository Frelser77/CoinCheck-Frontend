import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/reducer/loginUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
	const [credentials, setCredentials] = useState({ username: "", password: "" });
	const { isLoading, isError, errorMessage, loginSuccess, token } = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		// const isUsernameValid = validateUsername(credentials.username);
		// const isPasswordValid = validatePassword(credentials.password);

		// console.log(`Username: ${credentials.username}, Password: ${credentials.password}`); // Aggiunto per debug
		// console.log(`Username valido: ${isUsernameValid}, Password valida: ${isPasswordValid}`); // Aggiunto per debug

		// if (isUsernameValid && isPasswordValid) {
		// 	console.log("Provo a fare il login"); // Aggiunto per debug
		// 	dispatch(loginUser(credentials));
		// } else {
		// 	let errorMessages = [];
		// 	if (!isUsernameValid) {
		// 		errorMessages.push("Username non valido.");
		// 	}
		// 	if (!isPasswordValid) {
		// 		errorMessages.push("Password non valida.");
		// 	}
		// 	console.log("Errore di validazione:", errorMessages.join(" ")); // Aggiunto per debug
		// 	toast.error(errorMessages.join(" "));
		dispatch(loginUser(credentials));
	};

	// const validateUsername = (username) => {
	// 	// Ad esempio, verifica che l'username non sia vuoto e che abbia una lunghezza minima
	// 	return username && username.length >= 3;
	// };

	// const validatePassword = (password) => {
	// 	// Ad esempio, verifica che la password abbia almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero
	// 	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	// 	return passwordRegex.test(password);
	// };

	useEffect(() => {
		if (loginSuccess && !isError) {
			toast.success("Logged in Successfuly!");
			navigate("/");
		} else if (isError) {
			toast.error(errorMessage);
		}
	}, [loginSuccess, isError, errorMessage, navigate]);

	useEffect(() => {
		if (token) {
			navigate("/"); // Reindirizza se l'utente è già loggato
		}
	}, [token, navigate]);

	{
		isLoading && <div className="loader">Loading...</div>;
	}
	return (
		<>
			{/* {isError && (
				<div className="alert alert-danger" role="alert">
					Error: {errorMessage}
				</div>
			)}
			{loginSuccess && (
				<div className="alert alert-success" role="alert">
					Logged in successfully! Redirecting...
				</div>
			)}  */}
			<form onSubmit={handleSubmit} className="container mt-5">
				<div className="mb-3">
					<label htmlFor="usernameInput" className="form-label">
						Username:
					</label>
					<input
						type="text"
						className="form-control"
						id="usernameInput"
						autoComplete="username"
						value={credentials.username}
						onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="passwordInput" className="form-label">
						Password:
					</label>
					<input
						type="password"
						className="form-control"
						id="passwordInput"
						value={credentials.password}
						autoComplete="current-password"
						onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</>
	);
}

export default Login;