import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser, resetAuthState } from "../../redux/reducer/loginUser";
import Loader from "../Layout/Loader";
import { Card, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import Notifications from "./Notifica";

export default function Register() {
	const [userData, setUserData] = useState({
		username: "",
		password: "",
		email: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const isLoading = useSelector((state) => state.login.isLoading);
	const isError = useSelector((state) => state.login.isError);
	const reduxErrorMessage = useSelector((state) => state.login.errorMessage);
	const registrationSuccess = useSelector((state) => state.login.registrationSuccess);
	const [confirmPassword, setConfirmPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(resetAuthState());
		if (userData.password !== confirmPassword) {
			setErrorMessage("Le password non corrispondono.");
			return;
		}
		dispatch(registerUser(userData))
			.unwrap()
			.then(() => {
				navigate("/login");
			})
			.catch((error) => {
				setErrorMessage(error);
			});
	};

	useEffect(() => {
		if (isError && reduxErrorMessage) {
			setErrorMessage(reduxErrorMessage);
		} else {
			setErrorMessage(""); // Reset error message if there's no error
		}

		if (registrationSuccess) {
			setUserData({ username: "", password: "", email: "" }); // Reset form
			navigate("/login"); // Redirect to login page
		}
	}, [isError, reduxErrorMessage, registrationSuccess, navigate]);

	useEffect(() => {
		return () => {
			dispatch(resetAuthState());
		};
	}, [dispatch]);

	return (
		<Row className="zone-7 no-scrollbar no-scrol">
			<Loader isLoading={isLoading} />
			<Col xs={10} md={8} lg={5} className="mb-3 mx-auto mt-5">
				<Card className="border border-2 shadow-sm p-3 border-gold">
					<h2 className="text-center text-gold">Registrati</h2>
					<form onSubmit={handleSubmit}>
						{isError && (
							<div className="alert alert-danger" role="alert">
								{errorMessage}
							</div>
						)}
						<div className="mb-3 position-relative">
							{userData.email && (
								<label htmlFor="emailInput" className="form-label">
									Email
								</label>
							)}
							<input
								type="email"
								className="form-control myinput text-gold bg-transparent border-primary"
								id="emailInput"
								value={userData.email}
								onChange={(e) => setUserData({ ...userData, email: e.target.value })}
								required
								placeholder="Email"
							/>
						</div>
						<div className="mb-3 mt-xs-4 mt-lg-5 position-relative">
							{userData.username && (
								<label htmlFor="usernameInput" className="form-label">
									Username
								</label>
							)}
							<input
								type="text"
								className="form-control myinput text-gold bg-transparent border-primary"
								id="usernameInput"
								value={userData.username}
								autoComplete="username"
								onChange={(e) => setUserData({ ...userData, username: e.target.value })}
								required
								placeholder="Username"
							/>
						</div>
						<div className="mb-3 mt-xs-4 mt-lg-5 position-relative">
							{userData.password && (
								<label htmlFor="passwordInput" className="form-label">
									Password
								</label>
							)}
							<input
								type={showPassword ? "text" : "password"}
								className="form-control myinput text-gold bg-transparent border-primary"
								id="passwordInput"
								value={userData.password}
								autoComplete="new-password"
								onChange={(e) => setUserData({ ...userData, password: e.target.value })}
								required
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
						<div className="mb-3 mt-xs-4 mt-lg-5 position-relative">
							{confirmPassword && (
								<label htmlFor="confirmPasswordInput" className="form-label">
									Conferma Password
								</label>
							)}
							<input
								type={showConfirmPassword ? "text" : "password"}
								className="form-control myinput text-gold bg-transparent border-primary"
								id="confirmPasswordInput"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								placeholder="Conferma Password"
							/>
							<button
								className="btn-transparent bg-transparent text-gold border-0 me-1 mt-1 eye-icon"
								type="button"
								onClick={toggleShowConfirmPassword}
							>
								<FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
							</button>
						</div>
						<div className="d-flex align-items-center justify-content-between">
							<button type="submit" className="nav-link mylink text-gold point my-2" disabled={isLoading}>
								{isLoading ? "Registering..." : "Register"}
							</button>
							<NavLink to="/login" className="nav-link mylink point my-2">
								Login
							</NavLink>
						</div>
					</form>
				</Card>
			</Col>
		</Row>
	);
}
