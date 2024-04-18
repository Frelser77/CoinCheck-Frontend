import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/loginUser"; // Assicurati che il percorso sia corretto
import { persistor } from "../../redux/store/store"; // Assicurati che il percorso sia corretto
import { useNavigate } from "react-router-dom";
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Modal from "react-modal";

Modal.setAppElement("#root");

const LogoutButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.login?.user);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const handleLogout = async () => {
		// Esegue il logout sul frontend
		dispatch(logout());

		// Cancella lo stato persistente dal local storage
		await persistor.purge();

		navigate("/login");
		closeModal();
	};

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const path = window.location.pathname;
	const exatcliPath = path === "/utentiList/";
	const placement = exatcliPath ? "bottom" : "right";

	return (
		<>
			<OverlayTrigger
				trigger={["hover", "focus"]}
				placement={placement}
				overlay={<Tooltip id="tooltip">Logout</Tooltip>}
			>
				<button onClick={openModal} className="nav-item flex-center nav-link logout-text">
					<div className="logout-text">
						<FontAwesomeIcon icon={faSignOutAlt} />
						<span className="ms-1">Logout</span>
					</div>
				</button>
			</OverlayTrigger>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Conferma Logout"
				overlayClassName="ReactModal__Overlay--after-open"
				className="ReactModal__Content--after-open"
			>
				<p>Sei sicuro di voler effettuare il logout?</p>
				<div className="flex-center gap-2">
					<button onClick={handleLogout} className="btn btn-primary">
						<FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
						<span className="nav-text ms-1">Logout</span>
					</button>
					<button onClick={closeModal} className="btn btn-danger">
						<FontAwesomeIcon icon={faTimes} className="me-2" />
						<span className="nav-text ms-1 text-white">Annulla </span>
					</button>
				</div>
			</Modal>
		</>
	);
};

export default LogoutButton;
