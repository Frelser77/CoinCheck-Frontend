import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleLikePost, commentOnPost, softDeletePost } from "../../redux/reducer/Post/forumSlice";
import Comment from "./Comment";
import { Card, Col, Row, Dropdown } from "react-bootstrap";
import { Url } from "../../Config/config";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import CommentForm from "./CommentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import CustomImage from "../Utenti/CustomImage";
import Modal from "react-modal";
import styles from "./post.module.css";
import useUserRole from "../../hooks/useUserRole";
Modal.setAppElement("#root");

export const getUserNameStyle = (role) => {
	switch (role) {
		case "Admin":
			return "gradient-admin";
		case "Moderatore":
			return "gradient-moderator";
		case "UtenteBasic":
			return "gradient-basic";
		case "UtenteMedium":
			return "gradient-medium";
		case "UtentePro":
			return "gradient-pro";
		default:
			return "";
	}
};

const postAreEqual = (prevProps, nextProps) =>
	prevProps.post.id === nextProps.post.id &&
	JSON.stringify(prevProps.post.comments) === JSON.stringify(nextProps.post.comments);

const Post = memo(({ post, onEdit, currentUserId }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLikingPost = useSelector((state) => state.posts.isLikingPost);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [hasLikedPost, setHasLikedPost] = useState(post?.likes?.some((like) => like.userId === currentUserId));
	const [showComments, setShowComments] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [enlargedImage, setEnlargedImage] = useState(null);
	const { role, isLoading } = useUserRole();
	const userId = useSelector((state) => state.login.user?.userId);
	const [comments, setComments] = useState([]);
	const likingPostId = useSelector((state) => state.posts.likingPostId);
	const isLikingThisPost = post.postId === likingPostId;
	const [topThreeLikes, setTopThreeLikes] = useState([]);
	const [localComments, setLocalComments] = useState(post.comments);
	const [likeCount, setLikeCount] = useState(post.likeCount);

	useEffect(() => {
		setLikeCount(post.likeCount);
	}, [post.likeCount]);

	useEffect(() => {
		setLocalComments(post.comments);
	}, [post.comments]);

	useEffect(() => {
		if (post?.likes?.length > 0) {
			// Mappa i likes per arricchirli con il ruolo dell'utente
			const enrichedLikes = post.likes.map((like) => ({
				...like,
				style: getUserNameStyle(like.user?.roleName || ""),
			}));

			// Filtra i primi tre likes per mostrarli in modo prominente
			const topThreeLikes = enrichedLikes.slice(0, 3);
			setTopThreeLikes(topThreeLikes);

			// Verifica se l'utente corrente ha messo like al post
			const userHasLiked = post.likes.some((like) => like.userId === currentUserId);
			setHasLikedPost(userHasLiked);
		}
	}, [post.likes, currentUserId]);

	const handleLike = async () => {
		if (isLikingPost) {
			return;
		}

		try {
			const response = await dispatch(toggleLikePost({ postId: post.postId })).unwrap();
			if (response && response.likesDetails) {
				const updatedTopThreeLikes = response.likesDetails.slice(0, 3).map((like) => ({
					...like,
					style: getUserNameStyle(like.user?.ruoloNome || ""),
				}));
				setTopThreeLikes(updatedTopThreeLikes);
				setLikeCount(response.likeCount); // Aggiorna il conteggio dei likes qui
				const userHasLikedPost = response.likesDetails.some((like) => like.userId === currentUserId);
				setHasLikedPost(userHasLikedPost);
			}
		} catch (error) {
			console.error("Error updating like:", error);
			toast.error("Errore nell'aggiornamento del like.");
		}
	};

	const handleAddComment = (newComment) => {
		const updatedComments = [...localComments, newComment];
		setLocalComments(updatedComments);
	};

	const handleToggleComments = () => {
		setShowCommentForm(!showCommentForm);
	};

	const goToUserProfile = (userId) => {
		navigate(`/utenti/${userId}`);
	};

	const handleSoftDelete = () => {
		dispatch(softDeletePost(post.postId));
		toast.success("Post eliminato con successo.");
	};

	const handleComments = () => {
		setShowComments(!showComments);
	};

	const getTopComment = (comments) => {
		return comments?.slice().sort((a, b) => b.likeCount - a.likeCount)[0];
	};

	const openImageModal = (imageSrc) => {
		setEnlargedImage(imageSrc);
		setModalIsOpen(true);
	};

	// Funzione per chiudere il modal
	const closeImageModal = () => {
		setModalIsOpen(false);
	};

	const topComment = getTopComment(post.comments);

	const userImagePath = post.userImage
		? `${post.userImage.replace(/\\/g, "/")}?v=${post.postId}-${new Date(post.postDate).getTime()}`
		: " ";

	const postOwnerStyle = getUserNameStyle(post.userRole);

	// const topThreeLikes =
	// 	post.likes?.slice(0, 3).map((like) => {
	// 		const style = like.user ? getUserNameStyle(like.user.roleName) : "";
	// 		return { ...like, style };
	// 	}) || [];

	const getTimeDifference = (date) => {
		const now = new Date();
		const postDate = new Date(date);
		const differenceInSeconds = Math.floor((now - postDate) / 1000);
		const minutes = Math.floor(differenceInSeconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days === 1) {
			return `${days} giorno fa`;
		} else if (days > 0) {
			return `${days} giorni fa`;
		} else if (hours > 0) {
			return `${hours} ore fa`;
		} else if (minutes > 0) {
			return `${minutes} minuti fa`;
		} else {
			return "pochi secondi fa";
		}
	};

	const getDifferentComments = (comments) => {
		if (comments.length === 1) return "comment";
		else return "comments";
	};

	const updateCommentInList = (updatedComment) => {
		// Aggiorna i commenti nello stato locale o globale qui
		setComments(comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)));
	};

	return (
		// <Row className="justify-content-center">
		// <Col xs={12} sm={8}>
		<Card className="mb-4 post-card position-relative">
			<Card.Header className="d-flex align-items-center justify-content-between p-2">
				<div className="d-flex align-items-center">
					<CustomImage
						src={userImagePath}
						alt={post.userName}
						className="mr-2 point user-img-post"
						onClick={() => goToUserProfile(post.userId)}
						Url={Url}
					/>
					<strong onClick={() => goToUserProfile(post.userId)} className={`ms-2 point ${postOwnerStyle}`}>
						{post.userName}
					</strong>
				</div>
				<small className="ms-auto">{getTimeDifference(new Date(post.postDate))}</small>
			</Card.Header>
			{post.filePath && (
				<Card.Img
					variant="top"
					src={`${Url}${post.filePath.replace(/\\/g, "/")}`}
					alt="Post"
					onClick={() => openImageModal(`${Url}${post.filePath.replace(/\\/g, "/")}`)}
					className="point img-post"
				/>
			)}
			{/* Modal per l'immagine ingrandita */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeImageModal}
				contentLabel="Ingrandimento immagine"
				className={`${styles.Modal}`}
				overlayClassName={`${styles.Overlay}`}
			>
				<img src={enlargedImage} alt="Ingrandimento" className={`img-fluid ${styles.imgPost} `} />
			</Modal>
			<Card.Body className="p-2">
				<Card.Text className="mt-2">{post.content}</Card.Text>
				<div className="d-flex flex-column align-items-start justify-content-center gap-1">
					<div className="d-flex gap-1 align-items-center justify-content-between">
						{hasLikedPost ? (
							<FaHeart
								className={`me-1 point icon-like ${isLikingThisPost ? "like-loading" : "liked"}`}
								onClick={handleLike}
							/>
						) : (
							<FaRegHeart
								className={`me-1 point icon-like ${isLikingThisPost ? "like-loading" : ""}`}
								onClick={handleLike}
							/>
						)}
						<FaRegComment className="me-1 point icon-comment" onClick={handleToggleComments} />
						<span>{likeCount} likes</span>
					</div>

					<div className="like-profile-images d-flex align-items-start justify-content-between">
						<div className="me-4">
							{topThreeLikes.map((like, index) => (
								<CustomImage
									key={like.likeId}
									src={`${like.user.imageUrl.replace(/\\/g, "/")}`}
									alt={`Like by ${like.user.username}`}
									className={`profile-image ${index > 0 ? "overlapped" : ""}`}
									style={{ left: `${index * 7}%` }} // Modifica qui per posizionamento dinamico
									onClick={() => goToUserProfile(like.userId)}
									Url={Url}
								/>
							))}
						</div>
						<div className="ms-3 small-text">
							{topThreeLikes.map((like, index) => (
								<span
									key={`like-${like.likeId}-${index}`}
									className={`like-username point me-1 ${like.style}`}
									onClick={() => goToUserProfile(like.userId)}
								>
									{like.user.username}
								</span>
							))}
						</div>
					</div>
					{(role === "Admin" || role === "Moderatore" || post.userId === userId) && (
						<Dropdown className="edit-icon position-absolute span-top end-0 m-2 point">
							<Dropdown.Toggle variant="transparent" id="dropdown-basic" size="sm">
								<span className="dot">•••</span>
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => onEdit(post)}>Modifica</Dropdown.Item>
								<Dropdown.Item onClick={handleSoftDelete}>Elimina</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					)}
				</div>
				{showCommentForm && (
					<CommentForm postId={post.postId} postOwnerStyle={postOwnerStyle} onAddComment={handleAddComment} />
				)}
			</Card.Body>
			<Card.Footer className="p-2">
				<div className="comments-section">
					<div className="point" onClick={handleComments}>
						{post.comments?.length > 0
							? `${post.comments.length} ${getDifferentComments(post.comments)}`
							: "No comments yet."}
					</div>
					{showComments
						? // Mostra tutti i commenti se showComments è true
						  post.comments?.map((comment) => (
								<Comment
									key={comment.commentId}
									comment={comment}
									currentUserId={currentUserId}
									postId={post.id}
									updateCommentInList={updateCommentInList}
								/>
						  ))
						: // Mostra solo il commento con più like
						  topComment && (
								<Comment
									comment={topComment}
									currentUserId={currentUserId}
									postId={post.id}
									updateCommentInList={updateCommentInList}
								/>
						  )}
				</div>
			</Card.Footer>
		</Card>
		// </Col>
		// </Row>
	);
}, postAreEqual);

export default Post;
