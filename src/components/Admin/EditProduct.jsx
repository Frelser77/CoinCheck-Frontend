import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, deleteProduct } from "../../redux/reducer/Abbonamenti/abbonamentoFetch";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";

const getSignedUrl = async (fileName) => {
	const response = await fetch(`{backendURL}/generate-signed-url?fileName=${fileName}`);
	if (!response.ok) {
		throw new Error("Impossibile ottenere l'URL firmato dal server.");
	}
	return await response.json();
};

// Aggiungi il metodo per caricare l'immagine a Google Cloud
const uploadImageToCloud = async (file) => {
	const { signedUrl } = await getSignedUrl(file.name);
	await fetch(signedUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});
	return `https://storage.googleapis.com/immagine-abbonamenti/${file.name}`;
};

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

	const handleImageChange = async (event) => {
		const file = event.target.files[0];
		if (!file) {
			toast.error("Seleziona un file da caricare.");
			return;
		}
		try {
			const newImageUrl = await uploadImageToCloud(file);
			setFormData({ ...formData, imageUrl: newImageUrl });
		} catch (error) {
			toast.error("Errore durante il caricamento dell'immagine: " + error.message);
		}
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

	const imageUrl = productToEdit.imageUrl
		? productToEdit.imageUrl
				.replace(/\\/g, "/") // Sostituisce tutti i backslash con slash
				.replace(/uploads\/products\//, "") // Rimuove la parte specifica dell'URL
		: "/placeholder.png";
	return (
		<div className="d-flex align-items-center justify-content-center">
			<Col xs={12} md={4} className="mt-3">
				<Card>
					<Card.Header>
						<h2>Edit Product</h2>
					</Card.Header>
					<Card.Body>
						<Card.Img
							src={imageUrl} // Utilizza la variabile imageUrl
							alt={productToEdit.tipoAbbonamento}
							className="img-circle"
						/>

						<Form>
							{/* <Form.Group className="mb-3" controlId="formTipoAbbonamento">
								<Form.Label>Tipo Abbonamento</Form.Label>
								<Form.Control
									type="text"
									name="tipoAbbonamento"
									value={formData.tipoAbbonamento}
									onChange={handleChange}
								/>
							</Form.Group> */}
							<Form.Group className="mb-3" controlId="formImageUrl">
								<Form.Label>Immagine</Form.Label>
								<Form.Control
									type="file"
									name="tipoAbbonamento"
									// value={formData.tipoAbbonamento}
									onChange={handleImageChange}
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
