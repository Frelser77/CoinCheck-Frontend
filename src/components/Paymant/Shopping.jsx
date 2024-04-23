import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../redux/reducer/cartReducer";
import { fetchProducts } from "../../redux/reducer/Abbonamenti/abbonamentoFetch";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";
import useUserRole from "../../hooks/useUserRole";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const products = useSelector((state) => state.products.products);
	const loading = useSelector((state) => state.products.loading);
	const error = useSelector((state) => state.products.error);
	const cart = useSelector((state) => state.cart.cart);
	const { role, isLoading } = useUserRole();
	console.log("role", role);
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
		<Row className="g-2 mt-0 mt-lg-2 zone-7 no-scroll no-scrollbar">
			<div className="text-center text-white">
				<h2>
					Acquista <strong className="text-gold">SUBITO</strong> uno dei nostri abbonamenti
				</h2>
				<p>
					Ti <strong className="mylink">garantiranno</strong> dei vantaggi e alcune piccolezze{" "}
					<span className="text-underline"> nell'app!</span>
				</p>
			</div>
			{products.map((product) => (
				<Col xs={12} sm={4} key={product.idprodotto}>
					<Card className="h-100 position-relative">
						<Card.Img
							variant="top"
							src={product.imageUrl.replace("uploads\\products\\", "")}
							alt={product.tipoAbbonamento}
							className="mx-auto abbonamento"
						/>
						<Card.Body className="d-flex flex-column align-items-start justify-content-between">
							<Card.Title className="text-gold">{product.tipoAbbonamento}</Card.Title>
							<Card.Text>€{product.prezzo.toFixed(2)}</Card.Text>
							<Card.Text> {product.descrizione}</Card.Text>
							<div className="d-flex align-items-center justify-content-between gap-4 gap-lg-3 mx-auto">
								<button className="nav-link mylink text-gold text-underline" onClick={() => handleAddToCart(product)}>
									<FontAwesomeIcon icon={faCartPlus} /> <span className="d-block d-sm-none d-lg-block">Aggiungi </span>
								</button>
								<button className="nav-link mylink" onClick={() => handleRemoveFromCart(product.idprodotto)}>
									<FontAwesomeIcon icon={faTrash} /> <span className="d-block d-sm-none d-lg-block">Rimuovi </span>
								</button>
							</div>
							{(role === "Admin" || role === "Moderatore") && (
								<Link
									to={`/Abbonamenti/${product.idprodotto}/edit`}
									className="nav-link position-absolute top-0 end-0 m-2"
								>
									<FontAwesomeIcon icon={faEdit} />
								</Link>
							)}
						</Card.Body>
					</Card>
				</Col>
			))}
			<div className="text-center my-2">
				<Link to="/Checkout" className="nav-link text-gold mylink text-underline my-3">
					Checkout
				</Link>
			</div>
		</Row>
	);
};

export default ShoppingCart;
