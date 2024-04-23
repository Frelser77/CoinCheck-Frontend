import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, createPost, updatePost } from "../../redux/reducer/Post/forumSlice";
import Post from "./Post";
import PostModal from "./PostModal";
import { Col, Container, Row } from "react-bootstrap";
import PostSkeleton from "../Skeletorn/PostSkeleton";

const ForumHome = () => {
	const dispatch = useDispatch();
	const { posts, isLoading, hasMore } = useSelector((state) => state.posts);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [editingPost, setEditingPost] = useState(null);
	const [pageIndex, setPageIndex] = useState(0);
	const observerRef = useRef(null);
	const currentUserId = useSelector((state) => state.login.user?.userId);

	useEffect(() => {
		dispatch(fetchAllPosts({ pageIndex: 0, pageSize: 10 }));
	}, [dispatch]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					setPageIndex((prevPageIndex) => prevPageIndex + 1);
				}
			},
			{ threshold: 0.1 }
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [hasMore, isLoading]);

	useEffect(() => {
		if (pageIndex > 0) {
			dispatch(fetchAllPosts({ pageIndex, pageSize: 10 }));
		}
	}, [pageIndex, dispatch]);

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
			dispatch(createPost(formData)).then(() => {
				dispatch(fetchAllPosts({ pageIndex: 0, pageSize: 10 }));
				setPageIndex(0);
			});
		}
		closeModal();
	};

	return (
		<Container>
			<Row className="zone-6 no-scrollbar">
				<div className="d-flex align-items-center justify-content-start mt-3">
					<button
						className="nav-link mylink text-gold text-underline my-3 px-3 py-1 position-fixed top-0 left-0"
						onClick={() => openModal()}
					>
						Crea Post
					</button>
				</div>
				<Col xs={10} sm={5} className="mx-auto">
					{isLoading && pageIndex === 0
						? Array.from({ length: 3 }, (_, index) => <PostSkeleton key={index} />)
						: posts.map((post) => (
								<Post key={post.postId} post={post} onEdit={() => openModal(post)} currentUserId={currentUserId} />
						  ))}
				</Col>
				<div ref={observerRef} style={{ height: 20 }} />
			</Row>
			<PostModal isOpen={modalIsOpen} onClose={closeModal} onSubmit={handleModalSubmit} editingPost={editingPost} />
		</Container>
	);
};

export default ForumHome;
