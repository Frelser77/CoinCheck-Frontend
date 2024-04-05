import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts, createPost } from "../../redux/reducer/Post/forumSlice";
import Post from "./Post";
import Loader from "../Layout/Loader";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import ReactModal from "react-modal";

const ForumHome = () => {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts.posts);
	const isLoading = useSelector((state) => state.posts.isLoading);
	const isError = useSelector((state) => state.posts.isError);
	const errorMessage = useSelector((state) => state.posts.errorMessage);
	const [newPost, setNewPost] = useState({ title: "", content: "" });
	const [file, setFile] = useState(null);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	useEffect(() => {
		dispatch(fetchAllPosts());
	}, [dispatch]);

	useEffect(() => {
		if (isError && errorMessage) {
			toast.error(errorMessage);
		}
	}, [isError, errorMessage]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPost({ ...newPost, [name]: value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null); // Resetta l'anteprima se nessun file è selezionato
		}
		setFile(file); // Mantieni questa riga per impostare il file selezionato nello state
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!newPost.title || !newPost.content) {
			alert("Both title and content are required.");
			return;
		}

		const formData = new FormData();
		formData.append("title", newPost.title);
		formData.append("content", newPost.content);
		if (file) {
			formData.append("file", file); // Aggiungi il file solo se presente
		}

		dispatch(createPost(formData)); // Ora passiamo formData anziché un oggetto semplice
		setNewPost({ title: "", content: "" }); // Reset dei campi del form
		setFile(null); // Reset dello stato del file
	};

	if (isLoading) {
		return <Loader isLoading={isLoading} />;
	}

	return (
		<Container className="">
			<Col md={{ span: 8, offset: 2 }}>
				<Button variant="allight" onClick={openModal}>
					Crea Post
				</Button>

				<ReactModal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					contentLabel="Crea Post"
					ariaHideApp={false}
					style={{
						content: {
							top: "50%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							marginRight: "-50%",
							transform: "translate(-50%, -50%)",
							width: "50%", // Puoi regolare la larghezza qui
							border: "1px solid #ccc",
							borderRadius: "10px",
							padding: "20px",
						},
					}}
				>
					<Container>
						<Row className="justify-content-center">
							<Col xs={12} sm={8} md={6}>
								<h2>Create a Post</h2>
								<Form onSubmit={handleSubmit}>
									<Form.Group>
										{imagePreview && (
											<div className="mb-3">
												<img src={imagePreview} alt="Preview" className="img-thumbnail" />
											</div>
										)}
										<Form.Control type="file" onChange={handleFileChange} />
									</Form.Group>
									<Form.Group>
										<Form.Control
											name="title"
											type="text"
											value={newPost.title}
											onChange={handleInputChange}
											placeholder="Title"
											required
										/>
									</Form.Group>
									<Form.Group>
										<Form.Control
											as="textarea"
											name="content"
											value={newPost.content}
											onChange={handleInputChange}
											placeholder="What's on your mind?"
											rows={5}
											required
										/>
									</Form.Group>

									<Button variant="primary" type="submit">
										Post
									</Button>
								</Form>
								<Button variant="secondary" onClick={closeModal}>
									Chiudi
								</Button>
							</Col>
						</Row>
					</Container>
				</ReactModal>
			</Col>
			<Row className="mt-4 zone-7">
				<Col>{posts && posts.map((post) => <Post key={post.postId} post={post} />)}</Col>
			</Row>
		</Container>
	);
};

export default ForumHome;
