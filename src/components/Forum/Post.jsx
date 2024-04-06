import React, { useEffect, useState } from "react";
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

const Post = ({ post, onEdit, currentUserId }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [hasLikedPost, setHasLikedPost] = useState(post.likes.some((like) => like.userId === currentUserId));

	useEffect(() => {
		setHasLikedPost(post.likes.some((like) => like.userId === currentUserId));
	}, [post.likes, currentUserId]);

	const handleLike = async () => {
		await dispatch(toggleLikePost({ postId: post.postId }));
		setHasLikedPost((prevState) => !prevState); // Inverti lo stato del like
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

	// Sistemare il percorso dell'immagine
	const userImagePath = post.userImage ? `${Url}${post.userImage.replace(/\\/g, "/")}` : "default-profile-path";

	const postOwnerStyle = getUserNameStyle(post.userRole);

	const topThreeLikes =
		post.likes?.slice(0, 3).map((like) => {
			const style = like.user ? getUserNameStyle(like.user.roleName) : "";
			return { ...like, style };
		}) || [];

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

	return (
		<Row className="justify-content-center">
			<Col xs={12} md={6}>
				<Card className="mb-4 post-card position-relative">
					<Card.Header className="d-flex align-items-center justify-content-between p-2">
						<div className="d-flex align-items-center">
							<img
								src={userImagePath}
								alt={post.userName}
								className="rounded-circle mr-2 point img-xs"
								onClick={() => goToUserProfile(post.userId)}
								style={{ objectFit: "cover" }}
							/>
							<strong className={`ms-2 ${postOwnerStyle}`}>{post.userName}</strong>
						</div>
						<small className="ms-auto">Posted on {getTimeDifference(new Date(post.postDate))}</small>
					</Card.Header>
					{post.filePath && (
						<Card.Img
							variant="top"
							// className="post-img"
							src={`${Url}${post.filePath.replace(/\\/g, "/")}`}
							alt="Post"
						/>
					)}
					<Card.Body className="p-2">
						<Card.Text className="mt-2">{post.content}</Card.Text>
						<div className="d-flex flex-column align-items-start justify-content-center gap-1">
							<div className="d-flex gap-1 align-items-center justify-content-between">
								{hasLikedPost ? (
									<FaHeart className="me-1 point icon-like liked" onClick={handleLike} />
								) : (
									<FaRegHeart className="me-1 point icon-like" onClick={handleLike} />
								)}
								<FaRegComment className="me-1 point icon-comment" onClick={handleToggleComments} />
								<span>{post.likeCount} likes</span>
							</div>
							<div className="like-profile-images">
								{topThreeLikes.map((like, index) => (
									<img
										key={like.likeId}
										src={`${Url}${like.user.imageUrl.replace(/\\/g, "/")}`}
										alt={`Like by ${like.user.username}`}
										className={`profile-image point ${index > 0 ? "overlapped" : ""}`}
										onClick={() => goToUserProfile(like.userId)}
									/>
								))}
								{topThreeLikes.map((like) => (
									<span className={`like-username me-1 ${like.style}`} onClick={() => goToUserProfile(like.userId)}>
										{like.user.username}
									</span>
								))}
							</div>
							<Dropdown className="edit-icon position-absolute top-0 end-0 m-2 point">
								<Dropdown.Toggle variant="transparent" id="dropdown-basic" size="sm">
									<span>•••</span>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => onEdit(post)}>Modifica</Dropdown.Item>
									<Dropdown.Item onClick={handleSoftDelete}>Elimina</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						{showCommentForm && <CommentForm postId={post.postId} postOwnerStyle={postOwnerStyle} />}
					</Card.Body>
					<Card.Footer className="p-2">
						<div className="comments-section">
							<div>{post.comments?.length > 0 ? `${post.comments.length} comments` : "No comments yet."}</div>
							{post.comments &&
								post.comments.map((comment) => (
									<Comment key={comment.commentId} comment={comment} currentUserId={currentUserId} />
								))}
						</div>
					</Card.Footer>
				</Card>
			</Col>
		</Row>
	);
};

export default Post;
