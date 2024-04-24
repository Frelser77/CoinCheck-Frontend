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

const LogoutButton = ({ closeSidebar }) => {
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
					<div className="">
						<FontAwesomeIcon icon={faSignOutAlt} />
						<span className="nav-text ms-1">Logout</span>
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
				<p className="text-white fs-4">Sei sicuro di voler effettuare il logout?</p>
				<div className="flex-center gap-5">
					<button
						onClick={() => {
							handleLogout();
							if (!exatcliPath) {
								closeSidebar();
							}
						}}
						className="nav-link text-gold mylink text-underline"
					>
						<FontAwesomeIcon icon={faSignOutAlt} className="" />
						<span className="nav-text d-none d-md-block">Logout</span>
					</button>
					<button
						onClick={() => {
							closeModal();
							if (!exatcliPath) {
								closeSidebar();
							}
						}}
						className="nav-link mylink"
					>
						<FontAwesomeIcon icon={faTimes} className="" />
						<span className="nav-texttext-white d-none d-md-block">Annulla </span>
					</button>
				</div>
			</Modal>
		</>
	);
};

export default LogoutButton;
