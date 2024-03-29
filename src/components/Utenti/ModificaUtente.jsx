import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtente, updateUser, uploadProfileImage } from "../../redux/reducer/utentiApi";
import { handleFileUpload } from "../Utenti/DettaglioUtente";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

const ModificaUtente = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = useSelector((state) => state.login.token);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState("");
	const [utente, setUtente] = useState(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const utenteDetails = await dispatch(fetchUtente(id, token)).unwrap();
				setUtente(utenteDetails); // Imposta lo stato utente con i dettagli recuperati
				setUsername(utenteDetails.username);
				setEmail(utenteDetails.email);
				// Assicurati di avere l'URL completo se imageUrl è relativo
				const imageUrl = utenteDetails.imageUrl.startsWith("http")
					? utenteDetails.imageUrl
					: `${Url}${utenteDetails.imageUrl.replace(/\\/g, "/")}`;
				setImage(imageUrl);
			} catch (error) {
				console.error("Failed to fetch the user details", error);
				toast.error("Errore nel recupero dei dettagli dell'utente");
			}
		};

		fetchDetails();
	}, [dispatch, id, token]);

	// Adesso, passa `dispatch`, `id` e una funzione per aggiornare lo stato (qui usiamo direttamente `fetchDetails` per ricaricare l'utente)
	const handleImageUpload = (event) => handleFileUpload(event, dispatch, id, fetchDetails);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	// Chiamato quando l'utente seleziona un file
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let userData = {};

		if (username) userData.username = username;
		if (email) userData.email = email;

		if (password) {
			userData.password = password;
		}

		if (Object.keys(userData).length === 0) {
			toast.warning("Nessuna modifica effettuata");
			return;
		}

		try {
			const response = await dispatch(updateUser({ id, userData, token })).unwrap();
			toast.success("Modifiche effettuata con successo!");
			navigate(`/utenti/${id}`);
		} catch (error) {
			console.error("Failed to update the user", error);
			toast.error("Errore nell'aggiornamento dell'utente");
		}
	};

	return (
		<>
			<h1 className="text-start">Modifica Utente</h1>
			<div className="d-flex justify-content-center mt-4">
				<Col xs={12} md={8} lg={6}>
					<Card className="position-relative">
						<Row>
							{/* Colonna per l'immagine */}
							<Col md={4}>
								<div className="d-flex align-items-center justify-content-center">
									{image && <Card.Img variant="top" className="img-fluid" src={image} alt={username} />}
									{/* <div className="">
										<Button variant="outline-primary" className={`${styles.pst} + " " + position-absolute m-2`}>
											<BsPencil />
										</Button>
									</div> */}
								</div>
							</Col>

							{/* Colonna per il form */}
							<Col md={8}>
								<Card.Body>
									<Form onSubmit={handleSubmit}>
										<Form.Group>
											<Form.Label>Username</Form.Label>
											<Form.Control type="text" name="username" value={username} onChange={handleUsernameChange} />
										</Form.Group>
										<Form.Group>
											<Form.Label>Email</Form.Label>
											<Form.Control type="email" name="email" value={email} onChange={handleEmailChange} />
										</Form.Group>
										<Form.Group>
											<Form.Label>Nuova Password</Form.Label>
											<Form.Control
												type="password"
												name="password"
												autoComplete="new-password"
												value={password}
												onChange={handlePasswordChange}
											/>
										</Form.Group>
										<Button variant="primary" type="submit">
											Aggiorna Utente
										</Button>
									</Form>
									<Form onSubmit={handleImageUpload}>
										<Form.Group>
											<Form.Label>Carica Nuova Immagine</Form.Label>
											<Form.Control type="file" name="file" id="file" onChange={handleImageChange} />
										</Form.Group>
										<Button variant="success" type="submit">
											Carica
										</Button>
									</Form>
								</Card.Body>
							</Col>
						</Row>
					</Card>
				</Col>
			</div>
		</>
	);
};
export default ModificaUtente;
