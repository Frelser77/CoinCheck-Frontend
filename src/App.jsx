import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UtentiList from "./components/Admin/UtentiList";
import Home from "./components/Layout/Home";
import Navbar from "./components/Layout/MyNavBar";
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

// import "../assets/css/App.css";
// import CryptoDashboard from "./components/Coins/CryptoDashboard";
// import CoinLink from "./components/Layout/CoinsLink";

function App() {
	const { role, isLoading } = useUserRole();
	// console.log(role);

	if (isLoading) {
		return <div>Checking role status...</div>;
	}

	return (
		<BrowserRouter>
			<ToasterComponent />
			<Navbar />
			<RedirectToLoginIfLoggedOut />
			<Container fluid className="mt-2">
				{/* min-vh-100 */}
				<Row className="d-flex flex-grow-1">
					{role && <SideBarLeft />}

					{/* <div className="flex-grow-1 d-flex flex-column"> */}
					{/* <div className="flex-grow-1"> */}
					<Col xs={12} md={7}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />

							{/* Le seguenti sono rotte protette che richiedono autenticazione admin */}
							{(role === "Admin" || role === "Moderatore") && <Route path="/utentiList" element={<UtentiList />} />}
							{(role === "Admin" || role === "Moderatore" || role === "Utente") && (
								<Route path="/utenti/:id/edit" element={<ModificaUtente />} />
							)}
							{role === "Admin" && <Route path="/Abbonamenti/:id/edit" element={<EditProduct />} />}
							{/* {role === "Admin" && <Route path="/cryptoBoard" element={<CryptoDashboard />} />} */}

							<Route path="/coin/:coinId" element={<CoinDetail />} />
							<Route path="/utenti/:id" element={<DettaglioUtente />} />
							<Route path="/Abbonamenti" element={<ShoppingCart />} />
							<Route path="/Checkout" element={<CheckoutForm />} />
							<Route path="/Carrello" element={<Cart />} />
							<Route path="*" element={<h1>Pagina non trovata</h1>} />
						</Routes>
					</Col>
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
