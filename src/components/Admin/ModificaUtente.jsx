import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtente, updateUser, uploadProfileImage } from "../../redux/reducer/Utenti/utentiApi";
import { handleFileUpload } from "../Utenti/DettaglioUtente";
import { Card, Row, Col, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";
import { useToken } from "../../hooks/useToken";
import SkeletornRight from "../Skeletorn/SkeletornRight";

const ModificaUtente = ({ userId }) => {
	const { id: routeParamId } = useParams();
	const effectiveUserId = userId || routeParamId;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = useToken();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState("");
	const [utente, setUtente] = useState(null);
	const userLoggedId = useSelector((state) => state.login.user.userId);
	const imageInputRef = useRef(null);
	const isCurrentUser = effectiveUserId === userLoggedId;

	useEffect(() => {
		const fetchDetails = async () => {
			if (token && effectiveUserId) {
				try {
					const utenteDetails = await dispatch(fetchUtente(effectiveUserId, token)).unwrap();
					setUtente(utenteDetails);
					setUsername(utenteDetails.username);
					setEmail(utenteDetails.email);
					const imageUrl = utenteDetails.imageUrl.startsWith("http")
						? utenteDetails.imageUrl
						: `${Url}${utenteDetails.imageUrl.replace(/\\/g, "/")}`;
					setImage(imageUrl);
				} catch (error) {
					console.error("Failed to fetch the user details", error);
					toast.error("Errore nel recupero dei dettagli dell'utente");
				}
			}
		};

		fetchDetails();
	}, [dispatch, effectiveUserId, token]);

	if (!utente) {
		return <SkeletornRight />;
	}

	const handleImageUpload = (event) => handleFileUpload(event, dispatch, effectiveUserId, fetchDetails);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file));
		}
	};

	const triggerFileInput = () => {
		imageInputRef.current.click();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let userData = {};

		if (username) userData.username = username;
		if (email) userData.email = email;
		if (password) userData.password = password;

		if (Object.keys(userData).length === 0) {
			toast.warning("Nessuna modifica effettuata");
			return;
		}

		try {
			await dispatch(updateUser({ id: effectiveUserId, userData, token })).unwrap();
			toast.success("Modifiche effettuata con successo!");
			navigate(`/utenti/${effectiveUserId}`);
		} catch (error) {
			console.error("Failed to update the user", error);
			toast.error("Errore nell'aggiornamento dell'utente");
		}
	};

	return (
		<Col>
			<h1 className="text-start text">Modifica Utente: {utente.username}</h1>
			<div className=" mt-4">
				<Card className="position-relative">
					<Row>
						{/* Colonna per l'immagine */}
						<Col md={5} className="p-4 d-flex align-items-center justify-content-center">
							<OverlayTrigger key="top" placement="top" overlay={<Tooltip id={`tooltip-top`}>Carica Immagine</Tooltip>}>
								<Form onSubmit={handleImageUpload}>
									<div className="">
										{image && (
											<Card.Img
												variant="top"
												className="img-circle point img-md p-2"
												src={image}
												alt={username}
												onClick={triggerFileInput}
											/>
										)}
									</div>
									<Form.Group>
										<Form.Control
											type="file"
											name="file"
											id="file"
											onChange={handleImageChange}
											ref={imageInputRef}
											className="d-none"
										/>
									</Form.Group>
									<Button variant="success" type="submit" className="d-none"></Button>
								</Form>
							</OverlayTrigger>
						</Col>

						{/* Colonna per il form */}
						<Col md={7}>
							<Card.Body>
								<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
									<Form.Group>
										<Form.Label className="label">Username</Form.Label>
										<Form.Control
											type="text"
											name="username"
											value={username}
											onChange={handleUsernameChange}
											placeholder="username"
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label className="label">Email</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={email}
											onChange={handleEmailChange}
											placeholder="email"
										/>
									</Form.Group>

									{isCurrentUser && (
										<Form.Group>
											<Form.Label className="label">Nuova Password</Form.Label>
											<Form.Control
												type="password"
												name="password"
												autoComplete="new-password"
												value={password}
												onChange={handlePasswordChange}
												placeholder="password"
											/>
										</Form.Group>
									)}
									<Button variant="primary" type="submit">
										Aggiorna Utente
									</Button>
								</Form>
							</Card.Body>
						</Col>
					</Row>
				</Card>
			</div>
		</Col>
	);
};
export default ModificaUtente;
{
	/* <div className="">
										<Button variant="outline-primary" className={`${styles.pst} + " " + position-absolute m-2`}>
											<BsPencil />
										</Button>
									</div> */
}
