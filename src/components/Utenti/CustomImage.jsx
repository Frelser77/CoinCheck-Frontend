import React from "react";
import { Url } from "../../Config/config";

// Componente CustomImage
const CustomImage = ({ src, alt, className, style, onClick }) => {
	// Controlla se l'immagine è un placeholder
	const isPlaceholder = src && src.endsWith("placeholder-profile.png");

	// Aggiungi la classe 'inverted-image' se l'immagine è un placeholder
	const additionalClass = isPlaceholder ? "inverted-image" : "";

	// Assicurati che il percorso inizi con 'http' o 'https', se no aggiungi Url
	const basePath = Url.endsWith("/") ? Url : `${Url}/`;

	const imagePath = src && !src.startsWith("http") ? `${basePath}${src.replace(/\\/g, "/")}` : src;

	return (
		<img
			onClick={onClick}
			style={style}
			className={`img-circle point ${className} ${additionalClass}`}
			src={imagePath}
			alt={alt}
		/>
	);
};

export default CustomImage;
