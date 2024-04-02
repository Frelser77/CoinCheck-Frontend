import React, { useEffect, useState } from "react";
import { ListGroup, Button, Col } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import useHide from "../Tips/useHide";
import { useSelector } from "react-redux";
import useUserRole from "../../hooks/useUserRole";
import LogoutButton from "../Auth/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faArrowRight,
	faArrowLeft,
	faCoins,
	faWallet,
	faCog,
	faUserAlt,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faForumbee } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const SideBarLeft = ({ toggleSidebar, isSidebarOpen }) => {
	const user = useSelector((state) => state.login.user);
	const token = useSelector((state) => state.login?.token);
	const userId = user?.userId;
	const { role, isLoading } = useUserRole();
	const shouldHide = useHide(["/utentiList/"]);
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const sidebarClass = `side-bar-left ${isMobile ? "fixed-left" : ""} ${isSidebarOpen ? "col-2" : "col-1"}`;

	// Aggiorna lo stato di isMobile in base alla larghezza della finestra
	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < 768);
			// Su mobile, chiudi la sidebar quando si ridimensiona la finestra
			if (window.innerWidth < 768) {
				setIsSidebarOpen(false);
			}
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// const toggleSidebar = () => {
	// 	setIsSidebarOpen(!isSidebarOpen);
	// };

	if (shouldHide) {
		return null;
	}

	return (
		<motion.div
			id="app-nav"
			className={`${sidebarClass} position-relative `}
			initial={false}
			animate={{ width: isSidebarOpen ? "200px" : "100px" }} // Aggiusta le dimensioni in base al tuo layout
			transition={{ type: "spring", stiffness: 260, damping: 20 }}
		>
			{/* <div id="app-nav" className={`${sidebarClass} position-relative`}> */}
			<div onClick={toggleSidebar} className="toggle-sidebar-icon">
				<FontAwesomeIcon
					icon={isSidebarOpen ? faArrowLeft : faArrowRight}
					className="position-absolute top-0 end-0 m-3 point"
				/>
			</div>
			<div className="flex-center logo-section">
				<img id="logo" src="" alt="Logo" />
			</div>
			<Link to="/" className="nav-item flex-center nav-link">
				<FontAwesomeIcon icon={faHome} className="nav-icon me-2" />
				<span className="nav-text">Home</span>
			</Link>
			<Link to="/trade" className="nav-item flex-center nav-link">
				<FontAwesomeIcon icon={faForumbee} className="nav-icon me-2" />
				<span className="nav-text">Forum</span>
			</Link>
			<Link to="/wallet" className="nav-item flex-center nav-link">
				<FontAwesomeIcon icon={faWallet} className="nav-icon me-2" />
				<span className="nav-text">Wallet</span>
			</Link>
			{userId ? (
				<>
					<NavLink className="nav-item flex-center nav-link" to={`/utenti/${userId}`}>
						<FontAwesomeIcon icon={faUserAlt} className="nav-icon me-2" />
						<span className="nav-text">{user.username}</span>
						{/* <span className="nav-text">Profilo</span> */}
					</NavLink>
					{(role === "Admin" || role === "Moderatore") && (
						<NavLink className="nav-item flex-center nav-link" to="/utentiList/">
							<FontAwesomeIcon icon={faUsers} className="nav-icon me-2" />
							<span className="nav-text">Utenti</span>
						</NavLink>
					)}
					{/* <LogoutButton /> */}
				</>
			) : (
				<>
					<NavLink className="nav-link" to="/login">
						<span className="nav-text">Login</span>
					</NavLink>
					<NavLink className="nav-link" to="/register">
						<span className="nav-text">Register</span>
					</NavLink>
				</>
			)}
			<div className="d-flex align-items-center justify-content-center gap-1 flex-column">
				<LogoutButton />
				<Link to="/settings" className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={faCog} className="nav-icon me-2" />
					<span className="nav-text">Settings</span>
				</Link>
			</div>
			{/* </div> */}
		</motion.div>
	);
};

export default SideBarLeft;

// return (
// <Col xs={12} md={2}>
// 	<div className="side-bar-left lg-position-fixed left-0">
// 		<h2 className="ms-5">Menu</h2>
// 		<ListGroup className="ms-1">
// 			{/* Utilizza ListGroup.Item per ogni elemento della lista */}
// 			<ListGroup.Item className="border-0">
// 				{/* Usa il componente Button insieme al componente Link per creare un bottone che agisce come link */}
// 				<Link to="/watchlist" className="nav-link p-0">
// 					<div className="btn w-100 border-0 bg-list text-light">Watchlist</div>
// 				</Link>
// 			</ListGroup.Item>
// 			<ListGroup.Item className="border-0">
// 				<Link to="/wallet" className="nav-link p-0">
// 					<div className="btn w-100 border-0 bg-list text-light">Wallet</div>
// 				</Link>
// 			</ListGroup.Item>
// 			<ListGroup.Item className="border-0">
// 				<Link to="/trade" className="nav-link p-0">
// 					<div className="btn w-100 border-0 bg-list text-light">Trade</div>
// 				</Link>
// 			</ListGroup.Item>
// 			{/* Aggiungi qui altri elementi, seguendo lo stesso schema */}
// 		</ListGroup>
// 	</div>
// </Col>
