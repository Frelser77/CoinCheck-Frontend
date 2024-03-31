import React, { useEffect } from "react";
import { ListGroup, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useHide from "../Tips/useHide";
import { useSelector } from "react-redux";

const SideBarLeft = () => {
	const token = useSelector((state) => state.login?.token);
	const shouldHide = useHide(["/utentiList"]);

	if (shouldHide) {
		return null;
	}

	return (
		<Col xs={12} md={2}>
			<div className="side-bar-left lg-position-fixed left-0">
				<h2 className="ms-5">Menu</h2>
				<ListGroup className="ms-1">
					{/* Utilizza ListGroup.Item per ogni elemento della lista */}
					<ListGroup.Item className="border-0">
						{/* Usa il componente Button insieme al componente Link per creare un bottone che agisce come link */}
						<Link to="/watchlist" className="nav-link p-0">
							<div className="btn w-100 border-0 bg-list text-light">Watchlist</div>
						</Link>
					</ListGroup.Item>
					<ListGroup.Item className="border-0">
						<Link to="/wallet" className="nav-link p-0">
							<div className="btn w-100 border-0 bg-list text-light">Wallet</div>
						</Link>
					</ListGroup.Item>
					<ListGroup.Item className="border-0">
						<Link to="/trade" className="nav-link p-0">
							<div className="btn w-100 border-0 bg-list text-light">Trade</div>
						</Link>
					</ListGroup.Item>
					{/* Aggiungi qui altri elementi, seguendo lo stesso schema */}
				</ListGroup>
			</div>
		</Col>
	);
};

export default SideBarLeft;

<li>
	{" "}
	{/* <iframe
							style={{ borderRadius: "12px" }}
							src="https://open.spotify.com/embed/playlist/1Mnqh1lTf0hutAmdclpAwB?utm_source=generator&theme=0"
							width="100%"
							height="352"
							// frameBorder="0"
							allowfullscreen=""
							allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
							loading="lazy"
						></iframe> */}
</li>;
