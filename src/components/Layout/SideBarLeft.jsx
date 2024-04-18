import React, { useEffect, useState } from "react";
import { ListGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
	faCreditCard,
	faStar as faSolidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { faForumbee } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const SideBarLeft = ({ toggleSidebar, isSidebarOpen, setShowFavorites, showFavoritesLoaded }) => {
	const user = useSelector((state) => state.login.user);
	const token = useSelector((state) => state.login?.token);
	const userId = user?.userId;
	const { role, isLoading } = useUserRole();
	const shouldHide = useHide(["/utentiList/", "/wallet"]);
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [favoritesIcon, setFavoritesIcon] = useState(faRegularStar);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const sidebarClass = `side-bar-left ${isMobile ? "fixed-left" : ""} ${isSidebarOpen ? "col-2" : "col-1"}`;
	const closeSidebar = () => {
		if (isSidebarOpen) {
			// Controlla se la sidebar è aperta
			toggleSidebar(false); // Chiudi la sidebar
		}
	};

	useEffect(() => {
		// Aggiorna l'icona ogni volta che showFavoritesLoaded cambia
		setFavoritesIcon(showFavoritesLoaded ? faSolidStar : faRegularStar);
	}, [showFavoritesLoaded]);

	// Aggiorna lo stato di isMobile in base alla larghezza della finestra
	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth < 768) {
				isSidebarOpen(false);
			}
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const toggleFavorites = () => {
		setShowFavorites((prev) => {
			const newShowFavorites = !prev;
			setFavoritesIcon(newShowFavorites ? faSolidStar : faRegularStar); // Aggiorna immediatamente l'icona
			return newShowFavorites;
		});
	};

	if (shouldHide) {
		return null;
	}

	return (
		<motion.div
			id="app-nav"
			className={`${sidebarClass} `}
			initial={false}
			animate={{ width: isSidebarOpen ? "200px" : "100px" }}
			transition={{ type: "spring", stiffness: 260, damping: 20 }}
		>
			<div
				onClick={() => {
					toggleSidebar(false);
				}}
				className="toggle-sidebar-icon position-relative"
			>
				<FontAwesomeIcon
					icon={isSidebarOpen ? faArrowLeft : faArrowRight}
					className="position-absolute top-0 end-0 mt-2 point side-back"
				/>
			</div>
			<Link to={"/"} className="flex-center logo-section">
				<img
					id="logo"
					src="../../assets/img/png-prova-dark-mode.png"
					alt="Logo"
					className="point"
					onClick={() => closeSidebar()}
				/>
			</Link>
			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Home</Tooltip>}>
				<Link to="/" className="nav-item flex-center nav-link" onClick={() => closeSidebar()}>
					<FontAwesomeIcon icon={faHome} className="nav-icon" />
					<span className="nav-text ms-2">Home</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Forum</Tooltip>}>
				<Link to="/forum" className="nav-item flex-center nav-link" onClick={() => closeSidebar()}>
					<FontAwesomeIcon icon={faForumbee} className="nav-icon" />
					<span className="nav-text ms-2">Forum</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger
				trigger={["hover", "focus"]}
				placement="right"
				overlay={<Tooltip id="tooltip">Preferiti</Tooltip>}
			>
				<div
					onClick={() => {
						toggleFavorites();
						closeSidebar();
					}}
					className="nav-item flex-center nav-link"
				>
					<FontAwesomeIcon icon={favoritesIcon} className="nav-icon" />
					<span className="nav-text ms-2"> Watchlist</span>
				</div>
			</OverlayTrigger>

			<OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={<Tooltip id="tooltip">Trade</Tooltip>}>
				<Link to="/wallet" className="nav-item flex-center nav-link" onClick={() => closeSidebar()}>
					<FontAwesomeIcon icon={faWallet} className="nav-icon" />
					<span className="nav-text ms-2">Wallet</span>
				</Link>
			</OverlayTrigger>
			<OverlayTrigger
				trigger={["hover", "focus"]}
				placement="right"
				overlay={<Tooltip id="tooltip">Abbonamenti</Tooltip>}
			>
				<NavLink to="/abbonamenti" className="nav-item flex-center nav-link" onClick={() => closeSidebar()}>
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
							<NavLink className="nav-item flex-center nav-link" onClick={() => closeSidebar()} to="/utentiList/">
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
					trigger="click"
					placement="right"
					overlay={
						<Tooltip id="settings-tooltip">
							<ListGroup>
								<ListGroup.Item
									as={Link}
									to={`/utenti/${userId}`}
									className="nav-item flex-center align-items-start gap-2 my-item"
									onClick={() => closeSidebar()}
								>
									<FontAwesomeIcon icon={faUserAlt} className="nav-icon" />
									<span> Profilo {user.username}</span>
								</ListGroup.Item>
								<ListGroup.Item
									as={Link}
									to={`/utenti/${userId}/edit`}
									className="nav-item flex-center align-items-start gap-2 my-item"
									onClick={() => closeSidebar()}
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
