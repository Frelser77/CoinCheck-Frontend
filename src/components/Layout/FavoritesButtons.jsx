import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStar, BsStarFill } from "react-icons/bs";
import { toggleUserPreference } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const FavoriteButton = ({ coinDetails, userId, onSave }) => {
	const dispatch = useDispatch();
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	// const [isFavorited, setIsFavorited] = useState(userPreferences.some((p) => p.CriptoNome === coinDetails.id));
	const location = useLocation();

	const isCoinDetailPage = location.pathname.includes("/coin/");
	const tooltipPlacement = isCoinDetailPage ? "bottom" : "top";
	// Determina se il coinDetails corrente è favorito
	const checkIsFavorited = () => {
		return userPreferences.some((p) => p.CriptoNome === coinDetails.name);
	};

	const [isFavorited, setIsFavorited] = useState(checkIsFavorited());

	const handleFavoriteClick = () => {
		if (coinDetails && coinDetails.id) {
			dispatch(toggleUserPreference({ userId, criptoName: coinDetails.id }))
				.unwrap()
				.then((updatedPreferences) => {
					onSave(updatedPreferences); // onSave può essere usato per eseguire ulteriori azioni dopo il salvataggio
					setIsFavorited(checkIsFavorited()); // Aggiorna lo stato di isFavorited dopo il cambio di preferenza
				})
				.catch((error) => {
					console.error("Errore:", error);
					toast.error(`Errore nel salvataggio della criptovaluta con id ${coinDetails.id}: ${error}`);
				});
		}
	};

	useEffect(() => {
		setIsFavorited(checkIsFavorited()); // Assicurati di aggiornare lo stato quando le preferenze dell'utente cambiano
	}, [userPreferences, coinDetails.id]);

	return (
		<OverlayTrigger
			key={tooltipPlacement}
			placement={tooltipPlacement}
			overlay={<Tooltip id={`tooltip-${tooltipPlacement}`}>Watchlist</Tooltip>}
		>
			<div className={`${isFavorited ? "btn-starred" : ""} point`} onClick={handleFavoriteClick}>
				{isFavorited ? <BsStarFill /> : <BsStar />}
			</div>
		</OverlayTrigger>
	);
};

export default FavoriteButton;
