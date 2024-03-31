import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtente, deleteUser, restoreUser, uploadProfileImage } from "../../redux/reducer/Utenti/utentiApi";
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
import Loader from "../Layout/Loader";
import { useToken } from "../../hooks/useToken";

export const handleFileUpload = async (file, dispatch, id, setUtente) => {
	if (!file) {
		toast.error("Devi selezionare un file."); // Usato toast.error per coerenza
		return;
	}

	try {
		const result = await dispatch(uploadProfileImage({ userId: id, file })).unwrap();
		toast.success("Immagine caricata con successo!");
		setUtente((utente) => ({ ...utente, imageUrl: result.imagePath }));
	} catch (error) {
		toast.error("Impossibile caricare l'immagine");
	}
};

const DettaglioUtente = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [utente, setUtente] = useState(null);
	const token = useToken();
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	const isLoading = useSelector((state) => state.favorites.loading);
	const error = useSelector((state) => state.favorites.error);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

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

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		handleFileUpload(file, dispatch, id, setUtente); // Passa direttamente il file a handleFileUpload
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

	const triggerFileInput = () => {
		// Triggera il click sull'input del file
		fileInputRef.current.click();
	};

	return (
		<div className="mt-4">
			<Row>
				<Col xs={5}>
					<Form onSubmit={(event) => handleFileUpload(event, dispatch, id, setUtente)}>
						<FormGroup>
							{/* <FormLabel>Carica Immagine</FormLabel> */}
							<FormControl
								type="file"
								name="file"
								id="file"
								ref={fileInputRef}
								className="d-none"
								onChange={handleImageChange}
							/>
						</FormGroup>
						{/* <Button type="submit"></Button> */}
					</Form>
					<ListGroup className="mt-4">
						<ListGroup.Item className="text-center">Coins Preferite</ListGroup.Item>
						{preferenzeListItems.length > 0 ? preferenzeListItems : <ListGroup.Item>Nessuna preferenza</ListGroup.Item>}
					</ListGroup>
				</Col>
				<Col xs={12} md={7}>
					<Loader isLoading={isLoading} />

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
								// style={{ width: "100%", height: "350px" }}
								onClick={triggerFileInput}
								className="img-circle point img-xl"
							/>
							<CardText className="card-text">Username: {utente && utente.username}</CardText>
							<CardText className="card-text">Email: {utente && utente.email}</CardText>
							<CardText className="card-text">
								Stato account: {utente && utente.isActive ? "Attivo" : "Non attivo"}
							</CardText>
							<CardText className="card-text">
								Preferenze:{" "}
								{utente && utente.preferenzeUtentes.length > 0 ? utente.preferenzeUtentes.length : "Nessuna preferenza"}
							</CardText>
							<CardText className="card-text">
								Post: {utente && utente.posts.length > 0 ? utente.posts.length : "Nessun post"}
							</CardText>
							<Card.Text>
								Ultimo Accesso: {utente && utente.logAttivita && utente.logAttivita[utente.logAttivita.length - 1]}
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
				</Col>
			</Row>
		</div>
	);
};

export default DettaglioUtente;
