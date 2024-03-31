import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../redux/reducer/cartReducer";
import { fetchProducts } from "../../redux/reducer/Abbonamenti/abbonamentoFetch";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const products = useSelector((state) => state.products.products);
	const loading = useSelector((state) => state.products.loading);
	const error = useSelector((state) => state.products.error);
	const cart = useSelector((state) => state.cart.cart);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const handleAddToCart = (product) => {
		const isProductInCart = cart.some((item) => item.idProdotto === product.idProdotto);

		if (isProductInCart) {
			toast.warning("Puoi acquistare un tipo di abbonamento alla volta.");
		} else {
			dispatch(addToCart(product));
			toast.success("Prodotto aggiunto al carrello con successo!");
		}
	};

	const handleRemoveFromCart = (idProdotto) => {
		dispatch(clearCart(idProdotto)); // Assicurati che la funzione clearCart gestisca correttamente l'idProdotto
		toast.info("Prodotto rimosso dal carrello.");
	};

	if (loading) return <div>Loading products...</div>;

	return (
		<Row className="g-2 p-4 my-3">
			{products.map((product) => (
				<Col xs={12} md={4} key={product.idprodotto}>
					<Card className="h-100 abbonamento">
						<Card.Img
							variant="top"
							src={product.imageUrl ? `${Url}${product.imageUrl.replace(/\\/g, "/")}` : "/placeholder.png"}
							alt={product.tipoAbbonamento}
							style={{ objectFit: "cover", height: "200px" }} //
						/>
						<Card.Body className="d-flex flex-column align-items-start justify-content-between">
							<Card.Title>{product.tipoAbbonamento}</Card.Title>
							<Card.Text>Prezzo: €{product.prezzo.toFixed(2)}</Card.Text>
							<Card.Text>Descrizione: {product.descrizione}</Card.Text>
							<ButtonGroup>
								<div className="btn btn-outline-success" onClick={() => handleAddToCart(product)}>
									Premiumati
								</div>
								<div className="btn btn-outline-danger" onClick={() => handleRemoveFromCart(product.idprodotto)}>
									Rimuovi
								</div>
								<Link to={`/Abbonamenti/${product.idprodotto}/edit`} className="btn btn-outline-warning">
									Edit
								</Link>
							</ButtonGroup>
						</Card.Body>
					</Card>
				</Col>
			))}
			<div className="text-center mt-4">
				<Link to="/Checkout" className="btn btn-primary">
					Procedi al Checkout
				</Link>
			</div>
		</Row>
	);
};

export default ShoppingCart;
