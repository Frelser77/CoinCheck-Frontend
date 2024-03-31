import React, { useState } from "react";
// import './Tooltip.css'; // Assicurati di creare questo file CSS per lo stile

const Tooltip = ({ message }) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			onMouseOver={() => setIsVisible(true)}
			onMouseOut={() => setIsVisible(false)}
			style={{ position: "relative", display: "inline-block" }}
		>
			{isVisible && <div className="tooltip">{message}</div>}
			{/* Questo è l'elemento sopra il quale l'utente passerà il mouse. */}
			Passa il mouse sopra di me
		</div>
	);
};

export default Tooltip;
