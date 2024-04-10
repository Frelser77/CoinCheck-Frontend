import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser, resetAuthState } from "../../redux/reducer/loginUser";
import Loader from "../Layout/Loader";
import { Card, Col, Row } from "react-bootstrap";
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
		<>
			<Loader isLoading={isLoading} />
			<Col xs={5} className="my-3 mx-auto mt-5">
				<Card className="border border-2 shadow-sm p-3">
					<h2 className="text-start">Registrati</h2>
					<form onSubmit={handleSubmit}>
						{isError && (
							<div className="alert alert-danger" role="alert">
								{errorMessage}
							</div>
						)}
						<div className="mb3">
							<label htmlFor="emailInput" className="form-label">
								Email:
							</label>
							<input
								type="email"
								className="form-control"
								id="emailInput"
								value={userData.email}
								onChange={(e) => setUserData({ ...userData, email: e.target.value })}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="usernameInput" className="form-label">
								Username:
							</label>
							<input
								type="text"
								className="form-control"
								id="usernameInput"
								value={userData.username}
								autoComplete="username"
								onChange={(e) => setUserData({ ...userData, username: e.target.value })}
								required
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
								value={userData.password}
								autoComplete="new-password"
								onChange={(e) => setUserData({ ...userData, password: e.target.value })}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="confirmPasswordInput" className="form-label">
								Conferma Password:
							</label>
							<input
								type="password"
								className="form-control"
								id="confirmPasswordInput"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
						<div className="d-flex align-items-center justify-content-between">
							<button type="submit" className="btn btn-primary" disabled={isLoading}>
								{isLoading ? "Registering..." : "Register"}
							</button>
							<NavLink to="/login" className="btn btn-body point">
								Login
							</NavLink>
						</div>
					</form>
				</Card>
			</Col>
		</>
	);
}
