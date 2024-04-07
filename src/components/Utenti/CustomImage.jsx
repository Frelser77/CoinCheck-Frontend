import React from "react";
import { Url } from "../../Config/config";

// Componente CustomImage
const CustomImage = ({ src, alt, className, onClick }) => {
	// Controlla se l'immagine è un placeholder
	const isPlaceholder = src && src.endsWith("placeholder-profile.png");

	// Aggiungi la classe 'inverted-image' se l'immagine è un placeholder
	const additionalClass = isPlaceholder ? "inverted-image" : "";

	// Imposta il percorso dell'immagine
	const imagePath = isPlaceholder
		? `${Url}uploads/profile/placeholder-profile.png`
		: `${Url}${src.replace(/\\/g, "/")}`;

	return (
		<img onClick={onClick} className={`img-circle point ${additionalClass} ${className}`} src={imagePath} alt={alt} />
	);
};

export default CustomImage;
