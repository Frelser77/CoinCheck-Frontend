import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { commentOnPost } from "../../redux/reducer/Post/forumSlice";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";

const CommentForm = ({ postId, postOwnerStyle }) => {
	const dispatch = useDispatch();
	const [commentText, setCommentText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (commentText.trim()) {
			dispatch(commentOnPost({ postId, createCommentDto: { Content: commentText } }));
			setCommentText(""); // Reset del campo di testo dopo l'invio
		}
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
					Post
				</Button>
			</InputGroup>
		</Form>
	);
};

export default CommentForm;
