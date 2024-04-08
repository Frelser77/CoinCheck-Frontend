// PostModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Url } from "../../Config/config";

const PostModal = ({ isOpen, onClose, onSubmit, editingPost }) => {
	const [newPost, setNewPost] = useState({ title: "", content: "" });
	const [file, setFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	useEffect(() => {
		if (editingPost) {
			setNewPost({ title: editingPost.title, content: editingPost.content });
			if (editingPost.filePath) {
				setImagePreview(`${Url}${editingPost.filePath.replace(/\\/g, "/")}`);
			} else {
				setImagePreview(null);
			}
		} else {
			setNewPost({ title: "", content: "" });
			setImagePreview(null);
			setFile(null);
		}
	}, [editingPost]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
		setFile(file);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPost((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		onSubmit(newPost, file);
		dispatch(fetchAllPosts({ pageIndex: 0, pageSize: 10 }));
	};

	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>{editingPost ? "Modifica Post" : "Crea Post"}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					{imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid" />}
					<Form.Group className="mb-3">
						<Form.Control type="file" onChange={handleFileChange} />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							name="title"
							type="text"
							value={newPost.title}
							onChange={handleInputChange}
							placeholder="Title"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							as="textarea"
							name="content"
							value={newPost.content}
							onChange={handleInputChange}
							placeholder="What's on your mind?"
							rows={3}
							required
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={onClose}>
						Chiudi
					</Button>
					<Button variant="primary" type="submit">
						Salva Post
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default PostModal;
