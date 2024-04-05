import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { Url } from "../../Config/config";
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
	const userId = useSelector((state) => state.login.user.userId);
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
		const IdProdotto = cart.length > 0 ? cart[0].idprodotto : null; // Presumiamo che il carrello non sia vuoto

		fetchWithAuth(`${localhost}checkout/create-session`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				UserId: userId.toString(), // Assicurati che questo valore sia corretto
				IdProdotto: IdProdotto.toString(), // Assicurati che questo valore sia corretto
				Items: cart.map((item) => ({
					idprodotto: item.idprodotto,
					prezzo: item.prezzo,
					quantita: item.quantita,
					descrizione: item.descrizione,
					tipoAbbonamento: item.tipoAbbonamento,
				})),
			}),
		})
			.then((response) => response.json())
			.then((data) => {
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

	return (
		<>
			<Loader isLoading={isLoading} />
			<div id="checkout">
				<div>
					<h2>Shopping Cart</h2>
					<ul>
						{cart.map((item, index) => (
							<li key={index}>
								{item.tipoAbbonamento} - € {item.prezzo} - {item.quantita}
							</li>
						))}
					</ul>
				</div>

				<button className="btn btn-primary" onClick={() => handleCheckout(sessionId)}>
					Checkout
				</button>
			</div>
		</>
	);
};

export default CheckoutForm;
