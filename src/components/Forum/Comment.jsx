import React from "react";
import { useDispatch } from "react-redux";
import { toggleLikeComment } from "../../redux/reducer/Post/forumSlice";
import { FaRegHeart } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import { Url } from "../../Config/config";

const Comment = ({ comment }) => {
	const dispatch = useDispatch();

	const handleLike = () => {
		dispatch(toggleLikeComment({ commentId: comment.commentId }));
	};

	const commentUserImagePath = `${Url}${comment.userImage.replace(/\\/g, "/")}`;

	const getTimeDifference = (date) => {
		const now = new Date();
		const commentDate = new Date(date);
		const differenceInSeconds = Math.floor((now - commentDate) / 1000);
		const minutes = Math.floor(differenceInSeconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
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
		<div className="comment comment p-2">
			<div className="d-flex align-items-center justify-content-start">
				<span className="ml-auto">
					<img src={commentUserImagePath} alt="Immagine dell'utente" className="user-img-comment" />
				</span>
				<span className="ms-2 fs-6">{comment.userName}</span>
				<Badge className="ms-auto small-text bg-dark">{getTimeDifference(comment.commentDate)}</Badge>
			</div>
			<p>{comment.content}</p>
			<div className="d-flex align-items-center justify-content-start gap-1">
				<FaRegHeart className="mr-2 point" onClick={handleLike} />
				<span>{comment.likeCount} likes</span>
			</div>
		</div>
	);
};

export default Comment;
