import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
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
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { useToken } from "../../hooks/useToken";
import FavoriteButton from "../Layout/FavoritesButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { BsStar, BsStarFill } from "react-icons/bs";
import { loadUserPreferences, toggleUserPreference } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import CustomImage from "./CustomImage";

export const handleFileUpload = async (file, dispatch, id, setUtente) => {
	if (!file) {
		toast.error("Devi selezionare un file.");
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
	const [isLoadingDetails, setIsLoadingDetails] = useState(true);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const location = useLocation();
	const user = useSelector((state) => state.login.user);
	const isOwner = user?.userId === parseInt(id, 10);
	const [activeUserId, setActiveUserId] = React.useState(null);
	const [showPreferences, setShowPreferences] = useState(false);

	const handleDelete = async (userId) => {
		dispatch(deleteUser(userId));
		await fetchUserDetails();
		toast.success("Utente eliminato con successo!");
	};

	const handleRestore = async (userId) => {
		dispatch(restoreUser(userId));
		await fetchUserDetails();
		toast.success("Utente ripristinato con successo!");
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		handleFileUpload(file, dispatch, id, setUtente);
	};

	const fetchUserDetails = async () => {
		try {
			const utenteDetails = await dispatch(fetchUtente(id, token)).unwrap();
			setUtente(utenteDetails);
			setIsLoadingDetails(false);
		} catch (error) {
			console.error("Failed to fetch the user details", error);
			dispatch(showAlert({ message: error.message, type: "error" }));
			setIsLoadingDetails(false);
		}
	};

	useEffect(() => {
		fetchUserDetails();
	}, [dispatch, id, token]);

	const triggerFileInput = () => {
		// Triggera il click sull'input del file
		fileInputRef.current.click();
	};

	const checkIsFavorited = () => {
		return userPreferences.some((p) => p.CriptoNome === userPreferences.nomeCoin);
	};

	const [isFavorited, setIsFavorited] = useState(checkIsFavorited());

	const isCoinDetailPage = location.pathname.includes("/coin/");
	const tooltipPlacement = isCoinDetailPage ? "bottom" : "top";

	const handleDetailsClick = (coinId) => {
		navigate(`/coin/${coinId}`);
	};

	const handleLoadPreferenze = async () => {
		setActiveUserId(id); // Usa direttamente l'ID ottenuto da useParams
		const resultAction = await dispatch(loadUserPreferences(id));
		if (loadUserPreferences.fulfilled.match(resultAction)) {
			setShowPreferences(true);
			const { data } = resultAction.payload;
			if (data.length === 0) {
				setShowPreferences(true);
				dispatch(setUserPreferences([]));
			}
		}
	};

	// Funzione da richiamare quando l'utente clicca per aggiungere/rimuovere dalle preferenze
	const handleToggleFavorite = async (criptoName) => {
		try {
			await dispatch(
				toggleUserPreference({
					userId: utente.userId,
					criptoName: criptoName,
				})
			).unwrap();

			toast.success(`La preferenza per ${criptoName} è stata aggiornata.`);
			setIsFavorited(checkIsFavorited());
		} catch (error) {
			toast.error(`Impossibile aggiornare la preferenza per ${criptoName}: ${error.message}`);
		}
	};

	if (isLoadingDetails) {
		return <Loader isLoading={true} />;
	}

	return (
		<Row className="zone-8">
			<Col xs={12}>
				<h1 className="text-center text-light">Profilo {utente.username}</h1>
				<Card className="my-1">
					<Row>
						<Col>
							<CardBody className="d-flex flex-column align-items-start justify-content-between gap-2 sticky-top">
								<OverlayTrigger
									key="bottom"
									placement="bottom"
									overlay={<Tooltip id={`tooltip-bottom`}>Carica Immagine</Tooltip>}
									trigger="focus"
								>
									<CustomImage
										src={
											utente && utente.imageUrl
												? `${utente.imageUrl.replace(/\\/g, "/")}`
												: `${Url}uploads/profile/placeholder-profile.png`
										}
										alt={utente ? utente.username : "Default Image"}
										onClick={triggerFileInput}
										className="img-circle point img-lg mx-auto mb-3"
										Url={Url}
									/>
								</OverlayTrigger>
								<CardText className="card-text">Username: {utente && utente.username}</CardText>
								<CardText className="card-text">Email: {utente && utente.email}</CardText>
								<CardText className="card-text">
									Stato account: {utente && utente.isActive ? "Attivo" : "Non attivo"}
								</CardText>
								<CardText className="card-text">
									Post: {utente && utente.posts.length > 0 ? utente.posts.length : "Nessun post"}
								</CardText>
								<Card.Text>
									Ultimo Accesso: {utente && utente.logAttivita && utente.logAttivita[utente.logAttivita.length - 1]}
								</Card.Text>
								{isOwner && (
									<>
										<div className="d-flex align-items-center justify-content-start gap-2">
											{utente.isActive ? (
												<Button variant="outline-danger" onClick={() => handleDelete(utente.userId)}>
													Soft Delete
												</Button>
											) : (
												<Button variant="outline-success" onClick={() => handleRestore(utente.userId)}>
													Restore
												</Button>
											)}
											<Button variant="outline-primary" onClick={() => navigate(`/utenti/${utente.userId}/edit`)}>
												Modifica
											</Button>
										</div>
									</>
								)}
							</CardBody>
						</Col>
						<Col className="">
							<Form onSubmit={(event) => handleFileUpload(event, dispatch, id, setUtente)}>
								<FormGroup>
									<FormControl
										type="file"
										name="file"
										id="file"
										ref={fileInputRef}
										className="d-none"
										onChange={handleImageChange}
									/>
								</FormGroup>
							</Form>
							<h4 className="m-1">Preferiti</h4>
							<button className="btn btn-sm btn-body" onClick={handleLoadPreferenze}>
								Carica Preferenze
							</button>
							{showPreferences && userPreferences && userPreferences.length > 0 ? (
								<>
									{userPreferences.map((preferenza, index) => (
										<Card className="mt-4 other-card" key={index}>
											<Card.Body>
												<Row>
													<h3>{preferenza.nomeCoin}</h3>
													<Col xs={9} md={8} className="d-flex align-items-center justify-content-between gap-3">
														<Card.Text>Prezzo: {preferenza.PrezzoUsd} USD</Card.Text>
														<Card.Text>Variazione 24h: {preferenza.variazione24h}%</Card.Text>
														<Card.Text>Volume 24h: {preferenza.volume24h}</Card.Text>
													</Col>
													<Col xs={3} md={4} className="d-flex justify-content-end align-items-baseline gap-2">
														<OverlayTrigger
															key="top"
															placement="top"
															overlay={<Tooltip id={`tooltip-top`}>Dettagli coin</Tooltip>}
														>
															<div
																className="btn btn-transparent"
																onClick={() => handleDetailsClick(preferenza.nomeCoin)}
															>
																<FontAwesomeIcon className="" icon={faChartLine} />
															</div>
														</OverlayTrigger>
														<OverlayTrigger
															key={tooltipPlacement}
															placement={tooltipPlacement}
															overlay={<Tooltip id={`tooltip-${tooltipPlacement}`}>Watchlist</Tooltip>}
														>
															<div
																className={`${isFavorited ? "btn-starred" : ""} point`}
																onClick={() => handleToggleFavorite(preferenza.nomeCoin)}
															>
																{isFavorited ? <BsStarFill /> : <BsStar />}
															</div>
														</OverlayTrigger>
													</Col>
												</Row>
											</Card.Body>
										</Card>
									))}
								</>
							) : showPreferences ? (
								<p>L'utente non ha coin preferite</p>
							) : null}
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};

export default DettaglioUtente;
