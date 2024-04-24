import React, { useState, useEffect } from "react";

const Top = () => {
	const [isVisible, setIsVisible] = useState(false);
	const threshold = 400;

	const toggleVisibility = () => {
		if (window.scrollY > threshold) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	return (
		<div
			className="scroll-top"
			onClick={scrollTop}
			style={{
				opacity: isVisible ? 1 : 0,
				display: isVisible ? "block" : "none",
				transition: "opacity 0.2s ease-in-out", // Gestisce la transizione di opacità
			}}
		>
			<svg
				className="text-gold"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor"
				height={25}
				width={25}
			>
				<path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
			</svg>
		</div>
	);
};

export default Top;
