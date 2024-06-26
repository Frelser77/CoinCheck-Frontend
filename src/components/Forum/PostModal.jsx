import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createPost, editPost, updatePost } from "../../redux/reducer/Post/forumSlice";

const PostModal = ({ isOpen, onClose, editingPost }) => {
	const [newPost, setNewPost] = useState({ title: "", content: "" });
	const [file, setFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editingPost) {
			setNewPost({ title: editingPost.title, content: editingPost.content });
			setImagePreview(editingPost.filePath ? `${Url}${editingPost.filePath.replace(/\\/g, "/")}` : null);
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
		const formData = new FormData();
		Object.keys(newPost).forEach((key) => formData.append(key, newPost[key]));
		if (file) formData.append("file", file);

		if (editingPost) {
			await dispatch(editPost({ postId: editingPost.postId, formData }));
		} else {
			await dispatch(createPost(formData));
		}
		onClose();
	};

	return (
		<Modal show={isOpen} onHide={onClose} className="post-modal">
			<Modal.Header closeButton>
				<Modal.Title className="text-gold">{editingPost ? "Modifica Post" : "Crea Post"}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit} className="text-light">
				<Modal.Body>
					{imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid" />}
					<Form.Group className="mb-3">
						<Form.Control className="nav-link mylink text-gold p-1 border-0" type="file" onChange={handleFileChange} />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							style={{ resize: "none", height: "150px" }}
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
				<Modal.Footer className="border-0 flex-center flex-column flex-lg-row justify-content-lg-between">
					<button className="nav-link mylink" onClick={onClose}>
						Chiudi
					</button>
					<button className="nav-link mylink text-gold text-underline" type="submit">
						Salva Post
					</button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default PostModal;
