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

	useEffect(() => {
		const offCanvasElement = document.querySelector(".offcanvas.show");
		if (!show && offCanvasElement) {
			offCanvasElement.style.backgroundColor = "transparent";
		}
	}, [show]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		if (
			path === "/login" ||
			path === "/register" ||
			path === "/reset-password" ||
			(path === `/reset-password/${token}/${id}` && token && id)
		) {
			return null;
		}
	}, [path, token]);

	const options = [
		{
			name: "Enable both scrolling & backdrop",
			scroll: true,
			backdrop: true,
		},
	];

	return (
		<>
			{!showIcon && (
				<Button variant="body" onClick={handleShow} className="d-md-none btn-mobile">
					<FontAwesomeIcon icon={faBars} />
				</Button>
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
									toggleSidebar={handleClose}
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
