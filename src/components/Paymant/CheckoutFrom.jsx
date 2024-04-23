import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { Url } from "../../Config/config";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import fetchWithAuth from "../../redux/reducer/back/interceptor";

const localhost = Url;

const stripePromise = loadStripe(
	"pk_test_51OxDMgP1uJMO5zXfKn2xtz8GyNh1UpSKUMDdWeu4DYqHlvv6AZl2zB7FDb2SpVC4gFefFq8gMfJfgxcenkLkLPXR00PXxpnNmd"
);

const CheckoutForm = () => {
	const cart = useSelector((state) => state.cart.cart);
	console.log(cart);
	const userId = useSelector((state) => state.login.user?.userId);
	const [isLoading, setIsLoading] = useState(true);
	const [sessionId, setSessionId] = useState("");

	const handleCheckout = async (sessionId) => {
		const stripe = await stripePromise;
		const { error } = await stripe.redirectToCheckout({
			sessionId: sessionId,
		});
		if (error) {
			console.error(error);
			toast.error("Errore nel processo di checkout: " + error.message);
		} else {
			toast.success("Redirect al pagamento riuscito!");
		}
	};

	useEffect(() => {
		setIsLoading(true);
		const IdProdotto = cart.length > 0 ? cart[0].idprodotto : null;

		const items = cart.map((item) => ({
			idprodotto: item.idprodotto,
			prezzo: item.prezzo,
			quantita: item.quantita,
			descrizione: item.descrizione,
			tipoAbbonamento: item.tipoAbbonamento,
			ImageUrl: item.imageUrl ? item.imageUrl.replace(/uploads\/products\//g, "").replace(/\\/g, "/") : null,
		}));

		console.log("Items to send:", items);

		fetchWithAuth(`${localhost}checkout/create-session`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				UserId: userId.toString(),
				IdProdotto: IdProdotto ? IdProdotto.toString() : null,
				Items: items,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Received data:", data);
				setSessionId(data.sessionId);
				toast.info("Sessione di pagamento creata. Premi il pulsante per procedere al pagamento.");
			})
			.catch((error) => {
				toast.error("Errore nella creazione della sessione di pagamento.");
				console.error("Errore durante il fetch: ", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [cart, userId]);

	// if (isLoading) {
	// 	return <div>Loading...</div>;
	// }

	const getSubscriptionClass = (subscriptionType) => {
		switch (subscriptionType) {
			case "Basic":
				return "bronze";
			case "Medium":
				return "silver";
			case "Pro":
				return "gold";
			default:
				return ""; // Nessuna classe se non corrisponde
		}
	};

	return (
		<>
			<Loader isLoading={isLoading} />
			<Container id="checkout">
				<Row className="justify-content-center mt-4">
					<Col xs={12} md={5}>
						{cart.map((item, index) => (
							<React.Fragment key={index}>
								<h2 className="text-white text-center">
									Checkout abbonamento{" "}
									<span className={getSubscriptionClass(item.tipoAbbonamento)}>{item.tipoAbbonamento}</span>
								</h2>
								<Card className="mb-4">
									<Card.Img
										variant="top"
										src={`${item.imageUrl.replace(/uploads\\products\\/, "").replace(/\\/g, "/")}`}
										alt={item.descrizione}
										className="img-xl mx-auto"
									/>
									<Card.Body>
										<Card.Title>{item.tipoAbbonamento}</Card.Title>
										<Card.Text>
											Prezzo: €{item.prezzo} - Quantità: {item.quantita}
										</Card.Text>
										<Card.Text>{item.descrizione}</Card.Text>
									</Card.Body>
								</Card>
							</React.Fragment>
						))}
						<button className="nav-link mylink text-gold my-3 mx-auto" onClick={() => handleCheckout(sessionId)}>
							Prosegui con il Checkout
						</button>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default CheckoutForm;
