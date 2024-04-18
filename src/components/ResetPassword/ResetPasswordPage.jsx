import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { resetPassword } from "../../redux/ResetPassword/passwordResetSlice";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isResetSuccessful, setIsResetSuccessful] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token, userId } = useParams();

	const handlePasswordChange = (e) => setPassword(e.target.value);
	const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Le password non corrispondono");
			return;
		}
		try {
			const result = await dispatch(resetPassword({ token, userId, newPassword: password })).unwrap();
			toast.success("Password resettata con successo!");
			setIsResetSuccessful(true);
			setTimeout(() => navigate("/login"), 5000);
		} catch (error) {
			toast.error(error.message || "Errore nel reset della password. Riprova.");
		}
	};

	if (isResetSuccessful) {
		return (
			<Container className="d-flex justify-content-center align-items-center min-vh-100">
				<Row>
					<Col>
						<Card>
							<Card.Body>
								<p>La tua password è stata aggiornata con successo. Sarai reindirizzato al login in pochi secondi...</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<Container className="d-flex justify-content-center align-items-center min-vh-100">
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label className="label">Nuova Password</Form.Label>
									<Form.Control
										type="password"
										name="password"
										autoComplete="new-password"
										value={password}
										onChange={handlePasswordChange}
										placeholder="Nuova password"
										required
									/>
								</Form.Group>
								<Form.Group>
									<Form.Label className="label">Conferma Password</Form.Label>
									<Form.Control
										type="password"
										name="confirmPassword"
										autoComplete="new-password"
										value={confirmPassword}
										onChange={handleConfirmPasswordChange}
										placeholder="Conferma nuova password"
										required
									/>
								</Form.Group>
								<Button variant="primary" type="submit" className="mt-4">
									Reset Password
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default ResetPasswordPage;
