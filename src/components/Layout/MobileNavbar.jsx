import React, { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideBarLeft from "./SideBarLeft";

const MobileNavbar = () => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const offCanvasElement = document.querySelector(".offcanvas.show");
		if (!show && offCanvasElement) {
			offCanvasElement.style.backgroundColor = "transparent";
		}
	}, [show]);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Button variant="primary" onClick={handleShow} className="d-md-none">
				<FontAwesomeIcon icon={faBars} />
			</Button>

			<Offcanvas show={show} onHide={handleClose} placement="start" className="mobile-offcanvas" transition={false}>
				<Offcanvas.Body>
					<SideBarLeft
						isSidebarOpen={show}
						setShowFavorites={() => {}}
						showFavoritesLoaded={false}
						toggleSidebar={handleClose}
					/>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default MobileNavbar;
