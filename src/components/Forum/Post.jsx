import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleLikePost, commentOnPost } from "../../redux/reducer/Post/forumSlice";
import Comment from "./Comment";
import { Card, Col, Row } from "react-bootstrap";
import { Url } from "../../Config/config";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import CommentForm from "./CommentForm";
// import useUserRole from "../../hooks/useUserRole";

const Post = ({ post }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showCommentForm, setShowCommentForm] = useState(false);
	// const { role, isLoading } = useUserRole();
	console.log(post);

	const handleLike = () => {
		dispatch(toggleLikePost({ postId: post.postId }));
	};

	const handleToggleComments = () => {
		setShowCommentForm(!showCommentForm);
	};

	// const submitComment = (commentText) => {
	// 	dispatch(commentOnPost({ postId: post.postId, text: commentText }));
	// };

	const goToUserProfile = (userId) => {
		navigate(`/utenti/${userId}`);
	};

	// useEffect(() => {}, [post]);

	// Sistemare il percorso dell'immagine
	const userImagePath = post.userImage ? `${Url}${post.userImage.replace(/\\/g, "/")}` : "default-profile-path";

	const getUserNameStyle = (role) => {
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

	const postOwnerStyle = getUserNameStyle(post.userRole);

	const topThreeLikes =
		post.likes?.slice(0, 3).map((like) => {
			const style = like.user ? getUserNameStyle(like.user.roleName) : "";
			return { ...like, style };
		}) || [];

	// const postUserNameStyle = getUserNameStyle(post.userRole);

	return (
		<Row className="justify-content-center">
			<Col xs={12} md={8}>
				<Card className="mb-4 post-card">
					<Card.Header className="d-flex align-items-center justify-content-between p-2">
						<div className="d-flex align-items-center">
							<img
								src={userImagePath}
								alt={post.userName}
								className="rounded-circle mr-2"
								style={{ width: "40px", height: "40px", objectFit: "cover" }}
							/>
							<strong className={`ms-2 ${postOwnerStyle}`}>{post.userName}</strong>

							<small className="ms-3">Posted on {new Date(post.postDate).toLocaleDateString()}</small>
						</div>
					</Card.Header>
					{post.filePath && <Card.Img variant="top" src={`${Url}${post.filePath.replace(/\\/g, "/")}`} alt="Post" />}
					<Card.Body className="p-2">
						<Card.Text className="mt-2">{post.content}</Card.Text>
						<div className="d-flex flex-column align-items-start justify-content-center gap-1">
							<div className="d-flex gap-1 align-items-center justify-content-between">
								<FaRegHeart className="me-1 point icon-post" onClick={handleLike} />
								<FaRegComment className="me-1 point icon-post" onClick={handleToggleComments} />
								<span>{post.likeCount} likes</span>
							</div>
							<div className="like-profile-images">
								{topThreeLikes.map((like, index) => (
									<img
										key={like.likeId}
										src={`${Url}${like.user.imageUrl.replace(/\\/g, "/")}`}
										alt={`Like by ${like.user.username}`}
										className={`profile-image ${index > 0 ? "overlapped" : ""}`}
										onClick={() => goToUserProfile(like.userId)}
									/>
								))}
								{topThreeLikes.map((like) => (
									<span className={`like-username me-1 ${like.style}`} onClick={() => goToUserProfile(like.userId)}>
										{like.user.username}
									</span>
								))}
							</div>
						</div>
						{showCommentForm && <CommentForm postId={post.postId} postOwnerStyle={postOwnerStyle} />}
					</Card.Body>
					<Card.Footer className="p-2">
						<div className="comments-section">
							<div>{post.comments?.length > 0 ? `${post.comments.length} comments` : "No comments yet."}</div>
							{post.comments && post.comments.map((comment) => <Comment key={comment.commentId} comment={comment} />)}
						</div>
					</Card.Footer>
				</Card>
			</Col>
		</Row>
	);
};

export default Post;
