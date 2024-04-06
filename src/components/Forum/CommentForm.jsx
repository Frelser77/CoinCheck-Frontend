import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { commentOnPost, editComment } from "../../redux/reducer/Post/forumSlice";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";

const CommentForm = ({ postId, commentId = null, initialContent = "", onSave = () => {} }) => {
	const dispatch = useDispatch();
	const [commentText, setCommentText] = useState(initialContent);

	// Aggiorna il contenuto del commento se viene modificato dall'esterno (es. selezionando un altro commento da modificare)
	useEffect(() => {
		setCommentText(initialContent);
	}, [initialContent]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!commentText.trim()) return;

		const action = commentId
			? dispatch(editComment({ commentId, content: commentText }))
			: dispatch(commentOnPost({ postId, createCommentDto: { Content: commentText } }));

		action.then(() => {
			onSave(commentText); // Passa il testo modificato a onSave
			setCommentText(""); // Pulisci il campo di testo dopo l'invio
		});
	};

	return (
		<Form onSubmit={handleSubmit}>
			<InputGroup>
				<FormControl
					as="textarea"
					rows={3}
					placeholder="Add a comment..."
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
				<Button type="submit" variant="primary">
					{commentId ? "Salva" : "Posta"}
				</Button>
			</InputGroup>
		</Form>
	);
};

export default CommentForm;
