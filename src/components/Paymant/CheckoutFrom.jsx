import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

const localhost = Url;

const stripePromise = loadStripe(
	"pk_test_51OxDMgP1uJMO5zXfKn2xtz8GyNh1UpSKUMDdWeu4DYqHlvv6AZl2zB7FDb2SpVC4gFefFq8gMfJfgxcenkLkLPXR00PXxpnNmd"
);

const CheckoutForm = () => {
	const cart = useSelector((state) => state.cart.cart);
	console.log(cart);
	const [isLoading, setIsLoading] = useState(true);
	const [sessionId, setSessionId] = useState("");

	const handleCheckout = async (sessionId) => {
		const stripe = await stripePromise;
		const { error } = await stripe.redirectToCheckout({
			sessionId: sessionId,
		});
		if (error) {
			console.error(error);
			toast.error("Errore nel processo di checkout: " + error.message); // Mostra un messaggio di errore con il toast
		} else {
			// Potresti non arrivare mai qui perché redirectToCheckout redirige la pagina
			toast.success("Redirect al pagamento riuscito!"); // Mostra un messaggio di successo con il toast
		}
	};

	useEffect(() => {
		fetch(localhost + "checkout/create-session", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Items: cart,
			}),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					toast.error("Errore nella creazione della sessione di pagamento: " + error.message);
				}
			})
			.then((data) => {
				console.log(data);
				setSessionId(data.sessionId);
				toast.info("Sessione di pagamento creata. Premi il pulsante per procedere al pagamento.");
			});
	}, []);

	if (!sessionId) {
		return <div>Loading...</div>;
	}

	return (
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
	);
};

export default CheckoutForm;
