import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtente, deleteUser, restoreUser, uploadProfileImage } from "../../redux/reducer/utentiApi";
import {
	Card,
	CardBody,
	CardImg,
	CardText,
	CardTitle,
	Col,
	Form,
	FormGroup,
	FormControl,
	Button,
	FormLabel,
	Row,
	ListGroup,
} from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

export const handleFileUpload = async (event, dispatch, id, setUtente) => {
	event.preventDefault();
	const file = event.target.elements.file.files[0];
	if (!file) {
		dispatch(showAlert({ message: "Devi selezionare un file.", type: "error" }));
		return;
	}

	try {
		const result = await dispatch(uploadProfileImage({ userId: id, file })).unwrap();
		dispatch(showAlert({ message: "Upload riuscito.", type: "success" }));
		setUtente((utente) => ({ ...utente, imageUrl: result.imagePath }));
	} catch (error) {
		dispatch(showAlert({ message: error.message, type: "error" }));
	}
};

const DettaglioUtente = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [utente, setUtente] = useState(null);
	const token = useSelector((state) => state.login.token);
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	const navigate = useNavigate();

	const handleDelete = async (userId) => {
		await dispatch(deleteUser(userId));
		await fetchUserDetails();
		toast.success("Utente eliminato con successo!");
	};

	const handleRestore = async (userId) => {
		await dispatch(restoreUser(userId));
		await fetchUserDetails();
		toast.success("Utente ripristinato con successo!");
	};

	const fetchUserDetails = async () => {
		try {
			const utenteDetails = await dispatch(fetchUtente(id, token)).unwrap();
			setUtente(utenteDetails);
		} catch (error) {
			console.error("Failed to fetch the user details", error);
			dispatch(showAlert({ message: error.message, type: "error" }));
		}
	};

	useEffect(() => {
		fetchUserDetails();
	}, [dispatch, id, token]);

	// Assicurati che utente.preferenzeUtentes sia l'array delle preferenze dell'utente
	const preferenzeListItems = userPreferences.map((preferenza, index) => (
		<ListGroup.Item key={index}>{preferenza.criptoNome}</ListGroup.Item>
	));

	return (
		<div className="mt-4">
			<Row>
				<Col xs={5}>
					<Form onSubmit={(event) => handleFileUpload(event, dispatch, id, setUtente)}>
						<FormGroup>
							<FormLabel>Carica Immagine</FormLabel>
							<FormControl type="file" name="file" id="file" />
						</FormGroup>
						<Button type="submit">Carica</Button>
					</Form>
					<ListGroup className="mt-4">
						<ListGroup.Item className="text-center">Coins Preferite</ListGroup.Item>
						{preferenzeListItems.length > 0 ? preferenzeListItems : <ListGroup.Item>Nessuna preferenza</ListGroup.Item>}
					</ListGroup>
				</Col>
				<Col xs={12} md={7}>
					{utente ? (
						<Card>
							<CardBody>
								{/* <CardTitle>Dettagli Utente</CardTitle> */}
								<CardImg
									src={
										utente && utente.imageUrl
											? `${Url}${utente.imageUrl.replace(/\\/g, "/")}`
											: "path_to_default_image_or_placeholder.png"
									}
									alt={utente ? utente.username : "Default Image"}
									style={{ width: "100%", height: "350px" }}
								/>
								<CardText className="card-text">Username: {utente.username}</CardText>
								<CardText className="card-text">Email: {utente.email}</CardText>
								<CardText className="card-text">Stato account: {utente.isActive ? "Attivo" : "Non attivo"}</CardText>
								<CardText className="card-text">
									Preferenze:{" "}
									{utente.preferenzeUtentes.length > 0 ? utente.preferenzeUtentes.length : "Nessuna preferenza"}
								</CardText>
								<CardText className="card-text">
									Post: {utente.posts.length > 0 ? utente.posts.length : "Nessun post"}
								</CardText>
								<Card.Text>
									Ultimo Accesso: {utente.logAttivita && utente.logAttivita[utente.logAttivita.length - 1]}
								</Card.Text>
								<div className="d-flex align-items-center justify-content-start gap-2">
									<Button variant="outline-danger" onClick={() => handleDelete(utente.userId)}>
										Soft Delete
									</Button>
									<Button variant="outline-success" onClick={() => handleRestore(utente.userId)}>
										Restore
									</Button>
									<Button variant="outline-primary" onClick={() => navigate(`/utenti/${utente.userId}/edit`)}>
										Modifica
									</Button>
								</div>
							</CardBody>
						</Card>
					) : (
						<p>Caricamento dettagli utente...</p>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default DettaglioUtente;
