import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStar, BsStarFill } from "react-icons/bs";
import { loadUserPreferences, toggleUserPreference } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

const FavoriteButton = ({ coinDetails, userId, onSave }) => {
	const dispatch = useDispatch();
	const userPreferences = useSelector((state) => state.favorites.userPreferences);
	const [isFavorited, setIsFavorited] = useState(userPreferences.some((pref) => pref.nomeCoin === coinDetails.id));
	const starRef = useRef(null);

	const handleFavoriteClick = () => {
		if (coinDetails && coinDetails.id) {
			dispatch(toggleUserPreference({ userId, criptoName: coinDetails.id }))
				.unwrap()
				.then((updatedPreferences) => {
					dispatch(loadUserPreferences(userId));
					setIsFavorited(!isFavorited);
					// Chiamata alla funzione onSave con le preferenze aggiornate
					if (onSave) {
						onSave(updatedPreferences);
					}
					// Assicurati di animare solo l'icona cliccata
					gsap.fromTo(
						starRef.current,
						{ scale: 1 },
						{
							scale: 2,
							duration: 0.5,
							ease: "elastic.out(1, 0.3)",
							onComplete: () => {
								gsap.to(starRef.current, { scale: 1, duration: 0.5 });
							},
						}
					);
				})
				.catch((error) => {
					console.error("Error:", error);
					toast.error(`Errore nel salvataggio della criptovaluta con id ${coinDetails.id}: ${error.message}`);
				});
		}
	};

	useEffect(() => {
		setIsFavorited(userPreferences.some((pref) => pref.nomeCoin === coinDetails.id));
	}, [userPreferences]);

	// Animazione iniziale solo se è favorito
	useEffect(() => {
		if (isFavorited && starRef.current) {
			gsap.fromTo(starRef.current, { scale: 0.5 }, { scale: 1, duration: 0.5 });
		}
	}, [isFavorited]);

	return (
		<OverlayTrigger
			key={coinDetails.id}
			trigger={["hover", "focus"]}
			placement={"top"}
			overlay={<Tooltip id={`tooltip-top`}>Watchlist</Tooltip>}
		>
			<div
				ref={starRef}
				className={`point ${isFavorited ? "btn-starred" : ""}`}
				key={coinDetails.id}
				onClick={handleFavoriteClick}
			>
				{isFavorited ? <BsStarFill /> : <BsStar />}
			</div>
		</OverlayTrigger>
	);
};

export default FavoriteButton;
