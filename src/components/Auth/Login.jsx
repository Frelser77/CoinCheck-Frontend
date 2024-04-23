import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../../redux/reducer/loginUser";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Loader from "../Layout/Loader";
import { useToken } from "../../hooks/useToken";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
	const [credentials, setCredentials] = useState({ username: "", password: "" });
	const isLoading = useSelector((state) => state.login.isLoading);
	const isError = useSelector((state) => state.login.isError);
	const errorMessage = useSelector((state) => state.login.errorMessage);
	const loginSuccess = useSelector((state) => state.login.loginSuccess);
	const [showPassword, setShowPassword] = useState(false);
	const token = useToken();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

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
		dispatch(resetAuthState());

		if (token) {
			navigate("/"); // Reindirizza se l'utente è già loggato
		}

		return () => {
			dispatch(resetAuthState());
		};
	}, [token, navigate, dispatch]);

	return (
		<>
			<Loader isLoading={isLoading} />
			<Row className="d-flex aling-items-center justify-content-center zone-7 no-scrollbar">
				<Col xs={9} sm={7} md={6} lg={5} className="my-5">
					<Card className="p-3 login-card">
						<CardBody>
							<CardTitle className="text-center fs-2 text-primary">Login</CardTitle>
							<form onSubmit={handleSubmit} className="mt-5">
								<div className="mb-3 position-relative">
									{credentials.username && (
										<label htmlFor="usernameInput" className="form-label">
											Username
										</label>
									)}
									<input
										type="text"
										className="form-control text-gold bg-transparent border-primary"
										id="usernameInput"
										autoComplete="username"
										value={credentials.username}
										onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
										placeholder="Username"
									/>
								</div>
								<div className="mb-3 position-relative">
									{credentials.password && (
										<label htmlFor="passwordInput" className="form-label">
											Password
										</label>
									)}
									<input
										type={showPassword ? "text" : "password"}
										className="form-control bg-transparent border-primary text-gold"
										id="passwordInput"
										autoComplete="current-password"
										value={credentials.password}
										onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
										placeholder="Password"
									/>
									<button
										className="btn-transparent bg-transparent text-gold border-0 me-1 mt-1 eye-icon"
										type="button"
										onClick={toggleShowPassword}
									>
										<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
									</button>
								</div>
								<div className="d-flex align-items-center  justify-content-center justify-content-md-start">
									<button type="submit" className="nav-link text-gold mylink my-2">
										Login
									</button>
								</div>
							</form>
							<div className="d-flex align-items-center flex-column flex-md-row justify-content-end gap-2">
								<p className="p-0 m-0 text-gold">Non sei ancora registrato?</p>
								<NavLink to="/Register" className="nav-link mylink my-2">
									Registrati
								</NavLink>
							</div>
							<div className="text-center mt-3">
								<NavLink to="/reset-password" className="text-gold mylink my-2">
									Hai dimenticato la password?
								</NavLink>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default Login;
