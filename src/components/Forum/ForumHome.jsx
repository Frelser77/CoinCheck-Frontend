import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, createPost, updatePost } from "../../redux/reducer/Post/forumSlice";
import Post from "./Post";
import PostModal from "./PostModal";
import { Col, Container, Row } from "react-bootstrap";
import PostSkeleton from "../Skeletorn/PostSkeleton";
import { FaPlus } from "react-icons/fa";
import Top from "../Tips/Top";

const ForumHome = () => {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts.posts);
	const isLoading = useSelector((state) => state.posts.isLoading);
	const hasMore = useSelector((state) => state.posts.hasMore);
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

	const handleModalSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		Object.keys(newPost).forEach((key) => formData.append(key, newPost[key]));
		if (file) formData.append("file", file);

		if (editingPost) {
			await dispatch(updatePost({ postId: editingPost.postId, formData }));
			closeModal();
		} else {
			await dispatch(createPost(formData));
			closeModal();
		}
	};

	return (
		<Container>
			<Row className="zone-5 no-scrollbar">
				<div className="d-flex align-items-center justify-content-center mt-3">
					<button className="btn btn-body my-3 px-4 py-1" onClick={() => openModal()}>
						<FaPlus className="me-2" />
						<span>Crea Post</span>
					</button>
				</div>

				<Col xs={10} md={8} lg={6} className="mx-auto">
					{isLoading && pageIndex === 0
						? Array.from({ length: 3 }, (_, index) => <PostSkeleton key={index} />)
						: posts.map((post) => (
								<Post key={post.postId} post={post} onEdit={() => openModal(post)} currentUserId={currentUserId} />
						  ))}
				</Col>
				<div ref={observerRef} style={{ height: 20 }} />
				<Top />
			</Row>
			<PostModal isOpen={modalIsOpen} onClose={closeModal} onSubmit={handleModalSubmit} editingPost={editingPost} />
		</Container>
	);
};

export default ForumHome;
