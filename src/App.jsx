import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UtentiList from "./components/Admin/UtentiList";
import Home from "./components/Layout/Home";
// import Navbar from "./components/Layout/MyNavBar";
import DettaglioUtente from "./components/Utenti/DettaglioUtente";
import ModificaUtente from "./components/Admin/ModificaUtente";
import { Col, Container, Row } from "react-bootstrap";
import RedirectToLoginIfLoggedOut from "./components/Tips/LoginIfLogOut";
import ShoppingCart from "./components/Paymant/Shopping";
import Cart from "./components/Paymant/Cart";
import CheckoutForm from "./components/Paymant/CheckoutFrom";
import EditProduct from "./components/Admin/EditProduct";
import ToasterComponent from "./components/Tips/ToasterComponent";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CoinDetail from "./components/Coins/CoinDetail";
import Footer from "./components/Layout/Footer";
import CoinsLink from "./components/Coins/CoinsLink";
import SideBarLeft from "./components/Layout/SideBarLeft";
import useUserRole from "./hooks/useUserRole";
// import "../src/App.scss";
import "../assets/dist/css/App.min.css";
import MyNavbar from "./components/Layout/MyNavBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ForumHome from "./components/Forum/ForumHome";
import PageNotFound from "./components/Layout/PageNotFound";
import MobileNavbar from "./components/Layout/MobileNavbar";
import ResetPasswordPage from "./components/ResetPassword/ResetPasswordPage";
import NotLoggedReset from "./components/ResetPassword/NotLoggedReset";

function App() {
	const { role, isLoading } = useUserRole();
	// console.log(role);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showFavorites, setShowFavorites] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	if (isLoading) {
		return <div>Checking role status...</div>;
	}
	const mainContentWidth = isSidebarOpen ? "calc(100% - 820px)" : "calc(100% - 720px)";

	const adminRoutes = ["Admin"];
	const adminAndModeratorRoutes = ["Admin", "Moderatore"];
	const allRoutes = ["Admin", "Moderatore", "Utente", "UtenteBasic", "UtenteMedium", "UtentePro"];

	return (
		<BrowserRouter>
			<ToasterComponent />
			<MyNavbar />
			{isMobile && <MobileNavbar showFavorites={showFavorites} setShowFavorites={setShowFavorites} />}
			<RedirectToLoginIfLoggedOut />
			<Container fluid>
				<Row className="d-flex align-itmes-center justify-content-between  bef-logo">
					{!isMobile && role && (
						<SideBarLeft
							toggleSidebar={toggleSidebar}
							isSidebarOpen={isSidebarOpen}
							setShowFavorites={setShowFavorites}
						/>
					)}

					<motion.div
						className={`col-xs-12 col-md-${isSidebarOpen ? "7" : "8"} zone-6 no-scrollbar xscroll-none`}
						style={{ flexGrow: 1 }}
						animate={{ width: mainContentWidth }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}
					>
						<Routes>
							{allRoutes.includes(role) && (
								<Route path="/" element={<Home isSidebarOpen={isSidebarOpen} showFavorites={showFavorites} />} />
							)}

							<Route path="/login" element={<Login />} />
							<Route path="/Register" element={<Register />} />
							<Route path="/reset-password" element={<NotLoggedReset />} />
							<Route path="/reset-password/:token/:userId" element={<ResetPasswordPage />} />

							{/* Le seguenti sono rotte protette che richiedono autenticazione admin o moderatore*/}
							{adminAndModeratorRoutes.includes(role) && <Route path="/utentiList" element={<UtentiList />} />}
							{adminAndModeratorRoutes.includes(role) && (
								<Route path="/Abbonamenti/:id/edit" element={<EditProduct />} />
							)}
							{/* La seguente rotta é protetta e richiede l'autenticazione admin*/}
							{/* {allRoutes.includes(role) && <Route path="/cryptoBoard" element={<CryptoDashboard />} />} */}

							{/* Le seguenti rotte sono protette e richiedono un utente autorizzato con qualsiasi ruolo tra quelli permessi */}
							{allRoutes.includes(role) && <Route path="/utenti/:id/edit" element={<ModificaUtente />} />}
							{allRoutes.includes(role) && <Route path="/forum" element={<ForumHome />} />}
							{allRoutes.includes(role) && (
								<Route path="/coin/:coinId" element={<CoinDetail isSidebarOpen={isSidebarOpen} />} />
							)}
							{allRoutes.includes(role) && <Route path="/utenti/:id" element={<DettaglioUtente />} />}
							{allRoutes.includes(role) && <Route path="/Abbonamenti" element={<ShoppingCart />} />}
							{allRoutes.includes(role) && <Route path="/Checkout" element={<CheckoutForm />} />}
							{/* {allRoutes.includes(role) && <Route path="/Carrello" element={<Cart />} />} */}
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</motion.div>
					{role && <CoinsLink />}
				</Row>
			</Container>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
