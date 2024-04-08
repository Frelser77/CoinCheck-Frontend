import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStar, BsStarFill } from "react-icons/bs";
import { toggleUserPreference } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const FavoriteButton = ({ coinDetails, userId, onSave }) => {
	const dispatch = useDispatch();
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	const isLoading = useSelector((state) => state.favorites.loading);
	const error = useSelector((state) => state.favorites.error);
	const [isFavorited, setIsFavorited] = useState(false);
	const location = useLocation();

	const isCoinDetailPage = location.pathname.includes("/coin/");
	const tooltipPlacement = isCoinDetailPage ? "bottom" : "top";

	const checkIsFavorited = () => {
		return userPreferences.some((p) => p.nomeCoin === coinDetails.id);
	};
	useEffect(() => {
		setIsFavorited(checkIsFavorited());
	}, [userPreferences, coinDetails.id]);

	const handleFavoriteClick = () => {
		if (coinDetails && coinDetails.id) {
			dispatch(toggleUserPreference({ userId, criptoName: coinDetails.id }))
				.unwrap()
				.then((updatedPreferences) => {
					onSave(updatedPreferences);
					setIsFavorited((prev) => {
						const newFavoritedStatus = !prev;
						return newFavoritedStatus;
					});
				})
				.catch((error) => {
					console.error("Errore:", error);
					toast.error(`Errore nel salvataggio della criptovaluta con id ${coinDetails.id}: ${error.message}`);
				});
		}
	};

	// Aggiungi anche un log all'interno dell'effetto per tracciare i cambiamenti alle preferenze dell'utente
	useEffect(() => {
		const isCurrentlyFavorited = userPreferences.some((p) => p.nomeCoin === coinDetails.id);
		setIsFavorited(checkIsFavorited());
	}, [userPreferences, coinDetails.id]);

	return (
		<>
			<Loader isLoading={isLoading}></Loader>
			<OverlayTrigger
				key={tooltipPlacement}
				trigger={["hover", "focus"]}
				placement={tooltipPlacement}
				overlay={<Tooltip id={`tooltip-${tooltipPlacement}`}>Watchlist</Tooltip>}
			>
				<div className={`${isFavorited ? "btn-starred" : ""} point`} onClick={handleFavoriteClick}>
					{isFavorited ? <BsStarFill /> : <BsStar />}
				</div>
			</OverlayTrigger>
		</>
	);
};

export default FavoriteButton;
