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

		// Determina se è una nuova creazione o una modifica basata sulla presenza di commentId
		const action = commentId
			? dispatch(editComment({ commentId, content: commentText }))
			: dispatch(commentOnPost({ postId, createCommentDto: { Content: commentText } }));

		action
			.then((response) => {
				if (response.meta.requestStatus === "fulfilled") {
					onSave(commentText); // Usa onSave per passare il nuovo contenuto
					setCommentText(""); // Pulisci il campo del form
					if (onAddComment) onAddComment(response.payload); // Gestisci l'aggiunta del nuovo commento se necessario
				}
			})
			.catch((error) => {
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
