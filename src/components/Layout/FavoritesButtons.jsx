import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStar, BsStarFill } from "react-icons/bs";
import { toggleUserPreference } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import { toast } from "react-toastify";

const FavoriteButton = ({ coinDetails, userId, onSave }) => {
	const dispatch = useDispatch();
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	const [isFavorited, setIsFavorited] = useState(userPreferences.some((p) => p.CriptoNome === coinDetails.id));

	// Determina se il coinDetails corrente è favorito
	const checkIsFavorited = () => {
		return userPreferences.some((p) => p.CriptoNome === coinDetails.name); // Assicurati che sia 'name' o 'id'
	};

	const handleFavoriteClick = () => {
		if (coinDetails && coinDetails.id) {
			dispatch(toggleUserPreference({ userId, criptoName: coinDetails.id }))
				.unwrap()
				.then((updatedPreferences) => {
					// onSave può essere usato per eseguire ulteriori azioni dopo il salvataggio
					onSave(updatedPreferences);
				})
				.catch((error) => {
					console.error("Errore:", error);
					toast.error(`Errore nel salvataggio della criptovaluta con id ${coinDetails.id}: ${error}`);
				});
		}
	};

	useEffect(() => {
		setIsFavorited(userPreferences.some((p) => p.CriptoNome === coinDetails.name));
	}, [userPreferences, coinDetails.name]);

	return (
		<div className={`${isFavorited ? "btn-starred" : ""} point`} onClick={handleFavoriteClick}>
			{isFavorited ? <BsStarFill /> : <BsStar />}
		</div>
	);
};

export default FavoriteButton;
