import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editComment, softDeleteComment, toggleLikeComment } from "../../redux/reducer/Post/forumSlice";
import { Dropdown, Badge } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Url } from "../../Config/config";
import CommentForm from "./CommentForm";
import { getUserNameStyle } from "./Post";
import CustomImage from "../Utenti/CustomImage";
import useUserRole from "../../hooks/useUserRole";

const arePropsEqual = (prevProps, nextProps) =>
	prevProps.comment === nextProps.comment && prevProps.currentUserId === nextProps.currentUserId;

const Comment = memo(({ comment, currentUserId, postId, updateCommentInList }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const isLikingComment = useSelector((state) => state.posts.isLikingComment);
	const [isLiking, setIsLiking] = useState(false);
	const { role } = useUserRole();

	const onSave = async (newContent) => {
		const resultAction = await dispatch(editComment({ commentId: comment.commentId, content: newContent }));
		if (resultAction.meta.requestStatus === "fulfilled") {
			updateCommentInList(resultAction.payload);
		}
		setIsEditing(false);
	};

	const handleLike = async () => {
		if (isLiking) return; // Prevenire clic multipli durante l'operazione
		setIsLiking(true);
		const resultAction = await dispatch(toggleLikeComment({ commentId: comment.commentId }));
		if (resultAction.meta.requestStatus === "fulfilled") {
			// Aggiorna solo il like del commento corrente
			setIsLiking(false);
		}
	};

	const handleDeleteComment = () => {
		dispatch(softDeleteComment(comment.commentId));
	};

	const commentUserImagePath = `${comment.userImage.replace(/\\/g, "/")}`;
	const liked = comment.likes.some((like) => like.userId === currentUserId);

	const getTimeDifference = (date) => {
		const now = new Date();
		const commentDate = new Date(date);
		const differenceInSeconds = Math.floor((now - commentDate) / 1000);
		return differenceInSeconds < 60
			? "pochi secondi fa"
			: differenceInSeconds < 3600
			? `${Math.floor(differenceInSeconds / 60)} minuti fa`
			: differenceInSeconds < 86400
			? `${Math.floor(differenceInSeconds / 3600)} ore fa`
			: `${Math.floor(differenceInSeconds / 86400)} giorni fa`;
	};

	const goToUserProfile = (userId) => {
		navigate(`/utenti/${userId}`);
	};

	const postOwnerStyle = getUserNameStyle(comment.roleName);

	const likeIcon = liked ? (
		<FaHeart className={`me-1 point icon-like ${isLiking ? "like-loading" : "liked"}`} onClick={handleLike} />
	) : (
		<FaRegHeart className={`me-1 point icon-like ${isLiking ? "like-loading" : ""}`} onClick={handleLike} />
	);

	return (
		<div className="comment p-2 position-relative">
			<div className="d-flex align-items-center justify-content-start">
				<CustomImage
					src={commentUserImagePath}
					alt="Immagine dell'utente"
					className="user-img-comment point"
					onClick={() => goToUserProfile(comment.userId)}
					Url={Url}
				/>
				<span className={`ms-2 fs-6 ${postOwnerStyle}`}>{comment.userName}</span>
				<Badge className="ms-auto small-text bg-dark mt-2">{getTimeDifference(comment.commentDate)}</Badge>
				{(role === "Admin" || role === "Moderatore" || comment.userId === currentUserId) && (
					<Dropdown>
						<Dropdown.Toggle
							variant="transparent"
							id="dropdown-basic"
							size="sm"
							className="position-absolute comment-top"
						>
							<span className="dot">•••</span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => setIsEditing(true)}>Modifica</Dropdown.Item>
							<Dropdown.Item onClick={handleDeleteComment}>Elimina</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				)}
			</div>
			{isEditing ? (
				<CommentForm
					postId={postId}
					commentId={comment.commentId}
					initialContent={comment.content}
					onSave={(newComment) => updateCommentInList(newComment)}
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
}, arePropsEqual);

export default Comment;
