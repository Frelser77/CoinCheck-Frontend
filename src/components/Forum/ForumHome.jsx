// ForumHome.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, createPost, updatePost } from "../../redux/reducer/Post/forumSlice";
import Post from "./Post";
import PostModal from "./PostModal"; // Assicurati di importare PostModal
import Loader from "../Layout/Loader";
import { Button, Container, Row } from "react-bootstrap";

const ForumHome = () => {
	const dispatch = useDispatch();
	const { posts, isLoading, isError, errorMessage } = useSelector((state) => state.posts);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [editingPost, setEditingPost] = useState(null);
	const currentUserId = useSelector((state) => state.login.user.userId);

	useEffect(() => {
		dispatch(fetchAllPosts());
	}, [dispatch]);

	const openModal = (post = null) => {
		setEditingPost(post);
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const handleModalSubmit = (post, file) => {
		if (editingPost) {
			dispatch(updatePost({ ...post, postId: editingPost.postId, file }));
		} else {
			const formData = new FormData();
			Object.keys(post).forEach((key) => formData.append(key, post[key]));
			if (file) formData.append("file", file);
			dispatch(createPost(formData));
		}
		closeModal();
	};

	return (
		<Container>
			<Button variant="primary" onClick={() => openModal()}>
				Crea Post
			</Button>
			{isLoading && <Loader />}
			<Row className="zone-7">
				{[...posts].reverse().map((post) => (
					<Post key={post.postId} post={post} onEdit={() => openModal(post)} currentUserId={currentUserId} />
				))}
			</Row>
			<PostModal isOpen={modalIsOpen} onClose={closeModal} onSubmit={handleModalSubmit} editingPost={editingPost} />
		</Container>
	);
};

export default ForumHome;
