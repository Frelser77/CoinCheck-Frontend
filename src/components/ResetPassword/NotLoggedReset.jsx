import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendPasswordResetRequest } from "../../redux/ResetPassword/passwordResetSlice";
import { toast } from "react-toastify";
import { Form, Button, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const NotLoggedReset = () => {
	const [email, setEmail] = useState("");
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(sendPasswordResetRequest(email)).unwrap();
			toast.success("Se l'email corrisponde ad un account, ti abbiamo inviato un link per il reset della password.");
			setEmail(""); // Pulisci il campo dopo l'invio
		} catch (error) {
			toast.error("Errore nella richiesta di reset della password.");
		}
	};

	return (
		<div className="flex-center flex-column mt-5">
			<div className="text-white text-center">
				<h3>Reset Password</h3>
				<p>Inserisci un email per ricevere il link per resettare la password.</p>
			</div>
			<Form onSubmit={handleSubmit} className="mt-3">
				<InputGroup className="mb-5">
					<FormControl
						placeholder="Inserisci la tua email"
						aria-label="Inserisci la tua email"
						aria-describedby="basic-addon2"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						required
					/>
					<button id="button-addon2" type="submit" className="btn  btn-body">
						Richiedi Reset Password
					</button>
				</InputGroup>
			</Form>
			<NavLink to="/login" className="nav-link mylink point log-ind">
				Login
			</NavLink>
		</div>
	);
};

export default NotLoggedReset;
