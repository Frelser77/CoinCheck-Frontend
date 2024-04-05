// PageNotFound.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
	let navigate = useNavigate();

	return (
		<section className="error-body">
			<video
				preload="auto"
				className="background"
				src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/396624/err.mp4"
				autoPlay
				muted
				loop
			></video>
			<div className="message">
				<h1>404</h1>
				<div className="bottom">
					<p>You have lost your way</p>
					{/* Utilizzare `useNavigate` per la navigazione anziché un tag di ancoraggio puro */}
					<button onClick={() => navigate("/")}>return home</button>
				</div>
			</div>
		</section>
	);
};

export default PageNotFound;
