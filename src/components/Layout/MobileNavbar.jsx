import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideBarLeft from "./SideBarLeft";

const MobileNavbar = ({ showFavorites, setShowFavorites }) => {
	const [show, setShow] = useState(false);
	const path = useLocation().pathname;
	const { token, id } = useParams();
	const showIcon = useLocation().pathname === "/utentiList/";
	const [showButton, setShowButton] = useState(true);

	useEffect(() => {
		const pathsToHideButton = [
			"/login",
			"/Register",
			"/reset-password",
			`/reset-password/${token}/${id}`,
			"/utentiList/",
		];

		// Controlla se il path attuale è uno di quelli che non devono mostrare il pulsante
		const shouldHideButton = pathsToHideButton.includes(path) || (path.includes("/reset-password/") && token && id);

		setShowButton(!shouldHideButton); // Se deve nascondere il pulsante, setShowButton sarà false
	}, [path, token, id]);

	useEffect(() => {
		const offCanvasElement = document.querySelector(".offcanvas.show");
		if (!show && offCanvasElement) {
			offCanvasElement.style.backgroundColor = "transparent";
		}
	}, [show]);

	const handleToggle = () => setShow((prev) => !prev);

	const options = [
		{
			name: "Enable both scrolling & backdrop",
			scroll: true,
			backdrop: true,
		},
	];

	return (
		<>
			{showButton && (
				<>
					<button onClick={handleToggle} className="btn d-md-none btn-mobile btn-body">
						<img src="/assets/img/icon-16.png" alt="logo" className="img-fluid" />
					</button>
				</>
			)}
			<Container>
				<Row>
					<Col>
						<Offcanvas show={show} placement="start" className="mobile-offcanvas" transition={false}>
							<Offcanvas.Body>
								<SideBarLeft
									isSidebarOpen={show}
									setShowFavorites={setShowFavorites}
									showFavoritesLoaded={showFavorites}
									toggleSidebar={handleToggle}
								/>
							</Offcanvas.Body>
						</Offcanvas>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default MobileNavbar;
