import { useEffect, useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { commentOnPost, editComment } from "../../redux/reducer/Post/forumSlice";

// In CommentForm.js
const CommentForm = ({ postId, commentId = null, initialContent = "", onSave, onAddComment }) => {
	const dispatch = useDispatch();
	const [commentText, setCommentText] = useState(initialContent);

	useEffect(() => {
		setCommentText(initialContent);
	}, [initialContent]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!commentText.trim()) return;

		const action = commentId
			? dispatch(editComment({ commentId, content: commentText }))
			: dispatch(commentOnPost({ postId, createCommentDto: { Content: commentText } }));

		action
			.then((response) => {
				if (response.meta.requestStatus === "fulfilled") {
					if (onSave && typeof onSave === "function") {
						onSave(response.payload);
					}
					if (onAddComment && typeof onAddComment === "function") {
						onAddComment(response.payload);
					}
					setCommentText(""); // Pulisci il campo del form
				}
			})
			.catch((error) => {
				// Gestisci eventuali errori qui
				console.error("Failed to save comment:", error);
			});
	};

	return (
		<Form onSubmit={handleSubmit}>
			<InputGroup>
				<FormControl
					style={{ resize: "none", height: "80px" }}
					as="textarea"
					name="content"
					rows={3}
					placeholder="Add a comment..."
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					className="border-0 bg-transparent text-white"
				/>
				<button className="nav-link mylink text-gold text-underline">{commentId ? "Salva" : "Posta"}</button>
			</InputGroup>
		</Form>
	);
};

export default CommentForm;
