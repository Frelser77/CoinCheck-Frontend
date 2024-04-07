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
import { useState } from "react";
import { motion } from "framer-motion";
import ForumHome from "./components/Forum/ForumHome";
import PageNotFound from "./components/Layout/PageNotFound";

function App() {
	const { role, isLoading } = useUserRole();
	// console.log(role);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showFavorites, setShowFavorites] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	if (isLoading) {
		return <div>Checking role status...</div>;
	}
	const mainContentWidth = isSidebarOpen ? "calc(100% - 820px)" : "calc(100% - 720px)";

	return (
		<BrowserRouter>
			<ToasterComponent />
			<MyNavbar />
			<RedirectToLoginIfLoggedOut />
			<Container fluid className="">
				<Row className="d-flex align-itmes-center justify-content-between min-vh-100">
					{role && (
						<SideBarLeft
							toggleSidebar={toggleSidebar}
							isSidebarOpen={isSidebarOpen}
							setShowFavorites={setShowFavorites}
						/>
					)}

					<motion.div
						className={`col-xs-12 col-md-${isSidebarOpen ? "7" : "8"}`}
						style={{ flexGrow: 1 }}
						animate={{ width: mainContentWidth }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}
					>
						<Routes>
							<Route path="/" element={<Home isSidebarOpen={isSidebarOpen} showFavorites={showFavorites} />} />
							<Route path="/login" element={<Login />} />
							<Route path="/Register" element={<Register />} />

							{/* Le seguenti sono rotte protette che richiedono autenticazione admin */}
							{(role === "Admin" || role === "Moderatore") && <Route path="/utentiList" element={<UtentiList />} />}
							{(role === "Admin" || role === "Moderatore" || role === "Utente") && (
								<Route path="/utenti/:id/edit" element={<ModificaUtente />} />
							)}
							{role === "Admin" && <Route path="/Abbonamenti/:id/edit" element={<EditProduct />} />}
							{/* {role === "Admin" && <Route path="/cryptoBoard" element={<CryptoDashboard />} />} */}
							<Route path="/forum" element={<ForumHome />} />
							<Route path="/coin/:coinId" element={<CoinDetail />} />
							<Route path="/utenti/:id" element={<DettaglioUtente />} />
							<Route path="/Abbonamenti" element={<ShoppingCart />} />
							<Route path="/Checkout" element={<CheckoutForm />} />
							<Route path="/Carrello" element={<Cart />} />
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</motion.div>
					{/* </div> */}
					{/* </div> */}
					{role && <CoinsLink />}
				</Row>
			</Container>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
