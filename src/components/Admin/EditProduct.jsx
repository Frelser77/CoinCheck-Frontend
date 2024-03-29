import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, deleteProduct } from "../../redux/reducer/Abbonamenti/abbonamentoFetch";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

const EditProduct = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const products = useSelector((state) => state.products.products); // Esempio di come potresti recuperare i prodotti

	if (!products) {
		return <div>Loading products...</div>;
	}
	const productToEdit = products.find((product) => product.idprodotto.toString() === id);
	console.log(products);

	if (!productToEdit) {
		toast.error("Product not found!");
		return <div>Product not found! Please check the URL or go back to the product list.</div>;
	}

	const [formData, setFormData] = useState({
		tipoAbbonamento: productToEdit.tipoAbbonamento || "",
		quantita: productToEdit.quantita || "",
		prezzo: productToEdit.prezzo || "",
		descrizione: productToEdit.descrizione || "",
		imageUrl: productToEdit.imageUrl || "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleUpdate = () => {
		dispatch(updateProduct({ id: productToEdit.idprodotto, data: formData }))
			.unwrap()
			.then(() => {
				navigate("/abbonamenti");
				toast.success("Prodotto aggiornato con successo!");
			})
			.catch((error) => {
				console.error("Update failed: ", error);
				toast.error("Aggiornamento fallito: " + error.message);
			});
	};

	const handleDelete = async () => {
		try {
			await dispatch(deleteProduct(productToEdit.idprodotto)).unwrap();
			navigate("/abbonamenti");
			toast.success("Prodotto eliminato con successo!");
		} catch (error) {
			toast.error("Eliminazione fallita: " + error.message);
		}
	};
	return (
		<div className="d-flex align-items-center justify-content-center">
			<Col xs={12} md={4} className="mt-3">
				<Card>
					<Card.Header>
						<h2>Edit Product</h2>
					</Card.Header>
					<Card.Body>
						<Card.Img
							src={productToEdit.imageUrl ? `${Url}${productToEdit.imageUrl.replace(/\\/g, "/")}` : "/placeholder.png"}
							alt={productToEdit.tipoAbbonamento}
							className="img-circle"
						/>
						<Form>
							<Form.Group className="mb-3" controlId="formTipoAbbonamento">
								<Form.Label>Tipo Abbonamento</Form.Label>
								<Form.Control
									type="text"
									name="tipoAbbonamento"
									value={formData.tipoAbbonamento}
									onChange={handleChange}
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="formPrezzo">
								<Form.Label>Prezzo</Form.Label>
								<Form.Control type="number" name="prezzo" value={formData.prezzo} onChange={handleChange} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="formDescrizione">
								<Form.Label>Descrizione</Form.Label>
								<Form.Control as="textarea" name="descrizione" value={formData.descrizione} onChange={handleChange} />
							</Form.Group>
							<Button variant="primary" onClick={handleUpdate}>
								Update Product
							</Button>
							<Button variant="danger" onClick={handleDelete} className="ms-2">
								Delete Product
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Col>
		</div>
	);
};

export default EditProduct;
