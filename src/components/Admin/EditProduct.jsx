import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, deleteProduct } from "../../redux/reducer/Abbonamenti/abbonamentoFetch";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form } from "react-bootstrap";
import { Url } from "../../Config/config";
import { toast } from "react-toastify";
import fetchWithAuth from "../../redux/reducer/back/interceptor";

const getSignedUrl = async (fileName) => {
	// Usa la funzione personalizzata che include l'header di autorizzazione
	const response = await fetchWithAuth(`${Url}Abbonamenti/generate-signed-url?fileName=${fileName}`);
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
	const products = useSelector((state) => state.products?.products);

	if (!products) {
		return <div>Loading products...</div>;
	}
	const productToEdit = products.find((product) => product.idprodotto.toString() === id);
	console.log(products);

	if (!productToEdit) {
		toast.error("Product not found!");
		return <div>Product not found! Please check the URL or go back to the product list.</div>;
	}

	useEffect(() => {
		if (productToEdit) {
			setFormData({
				tipoAbbonamento: productToEdit.tipoAbbonamento,
				quantita: productToEdit.quantita,
				prezzo: productToEdit.prezzo,
				descrizione: productToEdit.descrizione,
				ImageUrl: productToEdit.imageUrl,
			});
		}
	}, [productToEdit]);

	const [formData, setFormData] = useState({
		tipoAbbonamento: productToEdit.tipoAbbonamento || "",
		quantita: productToEdit.quantita || "",
		prezzo: productToEdit.prezzo || "",
		descrizione: productToEdit.descrizione || "",
		ImageUrl: productToEdit.imageUrl || "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "prezzo") {
			// Sostituisci il punto con una virgola per il formato italiano
			const formattedValue = value.toString().replace(".", ",");
			setFormData((prevData) => ({
				...prevData,
				[name]: formattedValue,
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const handleImageChange = async (event) => {
		const file = event.target.files[0];
		if (!file) {
			toast.error("Seleziona un file da caricare.");
			return;
		}
		try {
			const newImageUrl = await uploadImageToCloud(file);
			if (newImageUrl) {
				setFormData((prevFormData) => ({
					...prevFormData,
					ImageUrl: newImageUrl, // Assicurati che newImageUrl non sia undefined
				}));
				toast.success("Immagine caricata con successo!");
			} else {
				throw new Error("Errore durante il ritorno del nuovo URL immagine");
			}
		} catch (error) {
			toast.error("Errore durante il caricamento dell'immagine: " + error.message);
		}
	};

	const handleUpdate = async (event) => {
		event.preventDefault();
		const data = new FormData();

		// Assicura che il prezzo sia nel formato corretto, anche se già gestito in `handleChange`
		const priceWithComma = formData.prezzo.toString().replace(".", ",");

		// Aggiungi i dati al FormData
		Object.keys(formData).forEach((key) => {
			data.append(key, key === "prezzo" ? priceWithComma : formData[key]);
		});

		try {
			await dispatch(updateProduct({ id: productToEdit.idprodotto, data })).unwrap();
			toast.success("Prodotto aggiornato con successo!");
			navigate("/abbonamenti");
		} catch (error) {
			toast.error("Aggiornamento fallito: " + error.message);
		}
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

	const imageUrlWithTimestamp = `${imageUrl}?timestamp=${new Date().getTime()}`;
	return (
		<div className="d-flex align-items-center justify-content-center">
			<Col xs={12} md={4} className="mt-3">
				<Card>
					<Card.Header>
						<h2>Edit Product</h2>
					</Card.Header>
					<Card.Body>
						<Card.Img src={imageUrlWithTimestamp} alt={productToEdit.tipoAbbonamento} className="img-circle" />

						<Form id="productForm">
							<Form.Group className="mb-3" controlId="formImageUrl">
								<Form.Label>Immagine</Form.Label>
								<Form.Control type="file" name="image" onChange={handleImageChange} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="formPrezzo">
								<Form.Label>Prezzo</Form.Label>
								<Form.Control type="text" name="prezzo" value={formData.prezzo} onChange={handleChange} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="formDescrizione">
								<Form.Label>Descrizione</Form.Label>
								<Form.Control
									as="textarea"
									style={{ resize: "none", height: "100px" }}
									name="descrizione"
									value={formData.descrizione}
									onChange={handleChange}
								/>
							</Form.Group>
							<div className="d-flex justify-content-between">
								<button className="nav-link mylink text-gold text-underline" onClick={handleUpdate}>
									Update Product
								</button>
								<button onClick={handleDelete} className="ms-2 nav-link mylink">
									Delete Product
								</button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</Col>
		</div>
	);
};

export default EditProduct;
