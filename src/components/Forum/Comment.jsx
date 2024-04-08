import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editComment, softDeleteComment, toggleLikeComment } from "../../redux/reducer/Post/forumSlice";
import { Button, Dropdown } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import { Url } from "../../Config/config";
import CommentForm from "./CommentForm";
import { getUserNameStyle } from "./Post";
import CustomImage from "../Utenti/CustomImage";

const Comment = ({ comment, currentUserId }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const isLikingComment = useSelector((state) => state.posts.isLikingComment);

	const addNewComment = (newComment) => {
		setIsEditing(false); // Chiude il form di modifica dopo l'invio
		// Aggiungi qui la logica per aggiungere il nuovo commento all'elenco dei commenti visibili
		// Potresti voler aggiornare lo stato locale o fare un'altra chiamata per ottenere l'elenco aggiornato dei commenti
	};

	const handleLike = async () => {
		if (isLikingComment) {
			// Evita più clic durante l'elaborazione
			return;
		}
		await dispatch(toggleLikeComment({ commentId: comment.commentId }));
		// Non invertire il hasLikedComment qui. Lascia che il reducer gestisca lo stato dopo la conferma del like dal server.
	};

	const handleDeleteComment = () => {
		dispatch(softDeleteComment(comment.commentId));
	};
	const commentUserImagePath = `${comment.userImage.replace(/\\/g, "/")}`;

	const hasLikedComment = comment.likes.some((like) => like.userId === currentUserId);

	const getTimeDifference = (date) => {
		const now = new Date();
		const commentDate = new Date(date);
		const differenceInSeconds = Math.floor((now - commentDate) / 1000);
		const minutes = Math.floor(differenceInSeconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const hasLikedComment = comment.likes.some((like) => like.userId === currentUserId);

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

	const goToUserProfile = (userId) => {
		navigate(`/utenti/${userId}`);
	};

	const postOwnerStyle = getUserNameStyle(comment.roleName);

	const handleSaveEdit = (editedContent) => {
		if (commentId) {
			dispatch(editComment({ commentId: comment.commentId, content: editedContent })).then(() => {
				setIsEditing(false);
			});
		}
	};

	const likeIcon = hasLikedComment ? (
		<FaHeart
			className={`me-1 point icon-like ${hasLikedComment && isLikingComment ? "like-loading" : "liked"}`}
			onClick={handleLike}
		/>
	) : (
		<FaRegHeart
			className={`me-1 point icon-like ${!hasLikedComment && isLikingComment ? "like-loading" : ""}`}
			onClick={handleLike}
		/>
	);

	return (
		<div className="comment comment p-2">
			<div className="d-flex align-items-center justify-content-start">
				<span className="ml-auto">
					<CustomImage
						src={commentUserImagePath}
						alt="Immagine dell'utente"
						className="user-img-comment point"
						onClick={() => goToUserProfile(comment.userId)}
						Url={Url}
					/>
				</span>
				<span className={`ms-2 fs-6 ${postOwnerStyle}`}>{comment.userName}</span>
				<Badge className="ms-auto small-text bg-dark">{getTimeDifference(comment.commentDate)}</Badge>
				<Dropdown>
					<Dropdown.Toggle variant="transparent" id="dropdown-basic" size="sm">
						<span>•••</span>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item onClick={() => setIsEditing(true)}>Modifica</Dropdown.Item>
						<Dropdown.Item onClick={handleDeleteComment}>Elimina</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			{isEditing ? (
				<CommentForm
					postId={postId}
					commentId={comment.commentId}
					initialContent={comment.content}
					onSave={addNewComment}
				/>
			) : (
				<>
					<p>{comment.content}</p>
					<div className="d-flex align-items-center justify-content-start gap-1">
						{likeIcon}
						<span>{comment.likeCount} likes</span>
					</div>
				</>
			)}
		</div>
	);
};

export default Comment;
