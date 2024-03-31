import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/reducer/loginUser";
import Loader from "../Layout/Loader";
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

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
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

	return (
		<>
			<Loader isLoading={isLoading} />
			{/* <Notifications /> */}
			<div className="container mt-5">
				<h2>Register</h2>
				{isError && (
					<div className="alert alert-danger" role="alert">
						{errorMessage}
					</div>
				)}
				<form onSubmit={handleSubmit}>
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
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{isLoading ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</>
	);
}
