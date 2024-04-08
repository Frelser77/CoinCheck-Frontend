import React, { useEffect, useState } from "react";
import { ListGroup, Button, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
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
	faSubscript,
	faCreditCard,
	faStar as faSolidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { faForumbee } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const SideBarLeft = ({ toggleSidebar, isSidebarOpen, setShowFavorites, showFavoritesLoaded }) => {
	const user = useSelector((state) => state.login.user);
	const token = useSelector((state) => state.login?.token);
	const userId = user?.userId;
	const { role, isLoading } = useUserRole();
	const shouldHide = useHide(["/utentiList/", "/wallet"]);
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const sidebarClass = `side-bar-left ${isMobile ? "fixed-left" : ""} ${isSidebarOpen ? "col-2" : "col-1"}`;

	const favoritesIcon = showFavoritesLoaded ? faSolidStar : faRegularStar;

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

	const toggleFavorites = () => {
		setShowFavorites((prev) => !prev);
	};

	if (shouldHide) {
		return null;
	}

	return (
		<motion.div
			id="app-nav"
			className={`${sidebarClass}`}
			initial={false}
			animate={{ width: isSidebarOpen ? "200px" : "100px" }}
			transition={{ type: "spring", stiffness: 260, damping: 20 }}
		>
			<div onClick={toggleSidebar} className="toggle-sidebar-icon position-relative">
				<FontAwesomeIcon
					icon={isSidebarOpen ? faArrowLeft : faArrowRight}
					className="position-absolute top-0 end-0 mt-2 point"
				/>
			</div>
			<div className="flex-center logo-section">
				<img id="logo" src="" alt="Logo" />
			</div>
			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Home</Tooltip>}>
				<Link to="/" className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={faHome} className="nav-icon" />
					<span className="nav-text ms-2">Home</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Forum</Tooltip>}>
				<Link to="/forum" className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={faForumbee} className="nav-icon" />
					<span className="nav-text ms-2">Forum</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger
				trigger={["hover", "focus"]}
				placement="right"
				overlay={<Tooltip id="tooltip">Preferiti</Tooltip>}
			>
				<div onClick={toggleFavorites} className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={favoritesIcon} className="nav-icon" />
					<span className="nav-text ms-2"> Watchlist</span>
				</div>
			</OverlayTrigger>

			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Trade</Tooltip>}>
				<Link to="/wallet" className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={faWallet} className="nav-icon" />
					<span className="nav-text ms-2">Wallet</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger
				trigger={["hover", "focus"]}
				placement="right"
				overlay={<Tooltip id="tooltip">Abbonamenti</Tooltip>}
			>
				<NavLink to="/abbonamenti" className="nav-item flex-center nav-link">
					<FontAwesomeIcon icon={faCreditCard} className="nav-icon" />
					<span className="nav-text ms-2">Abbonati</span>
				</NavLink>
			</OverlayTrigger>
			{userId ? (
				<>
					{(role === "Admin" || role === "Moderatore") && (
						<OverlayTrigger
							trigger={["hover", "focus"]}
							placement="right"
							overlay={<Tooltip id="tooltip">Utenti</Tooltip>}
						>
							<NavLink className="nav-item flex-center nav-link" to="/utentiList/">
								<FontAwesomeIcon icon={faUsers} className="nav-icon" />
								<span className="nav-text ms-2">Utenti</span>
							</NavLink>
						</OverlayTrigger>
					)}
					{/* <LogoutButton /> */}
				</>
			) : (
				<>
					<OverlayTrigger
						trigger={["hover", "focus"]}
						placement="right"
						overlay={<Tooltip id="tooltip">Accedi</Tooltip>}
					>
						<NavLink className="nav-link" to="/login">
							<span className="nav-text ms-2">Login</span>
						</NavLink>
					</OverlayTrigger>
					<OverlayTrigger
						trigger={["hover", "focus"]}
						placement="right"
						overlay={<Tooltip id="tooltip">Registrati</Tooltip>}
					>
						<NavLink className="nav-link" to="/register">
							<span className="nav-text ms-2">Register</span>
						</NavLink>
					</OverlayTrigger>
				</>
			)}
			<div className="flex-center gap-1 flex-column">
				<LogoutButton />
				<OverlayTrigger
					trigger="click" // Puoi cambiare a "hover" se vuoi che si attivi con l'hover
					placement="right"
					overlay={
						<Tooltip id="settings-tooltip">
							<ListGroup>
								<ListGroup.Item
									as={Link}
									to={`/utenti/${userId}`}
									className="nav-item flex-center align-items-start gap-2 my-item"
								>
									<FontAwesomeIcon icon={faUserAlt} className="nav-icon" />
									<span> Profilo {user.username}</span>
								</ListGroup.Item>
								<ListGroup.Item
									as={Link}
									to={`/utenti/${userId}/edit`}
									className="nav-item flex-center align-items-start gap-2 my-item"
								>
									<FontAwesomeIcon icon={faUserAlt} className="nav-icon" />
									<span> Edit {user.username} </span>
								</ListGroup.Item>
							</ListGroup>{" "}
						</Tooltip>
					}
				>
					<Button className="nav-item flex-center nav-link">
						<FontAwesomeIcon icon={faCog} className="nav-icon" />
						<span className="nav-text ms-2">Impostazioni</span>
					</Button>
				</OverlayTrigger>
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
