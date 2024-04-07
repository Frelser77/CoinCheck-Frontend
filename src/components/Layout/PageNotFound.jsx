import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const PageNotFound = () => {
	let navigate = useNavigate();

	return (
		<Container>
			<Row className="justify-content-md-center display-6">
				<Col md="auto" className="code-area">
					<span className="comment-404">// 404 page not found.</span>
					<span>
						<span className="keyword">if</span>(<span className="negation">!</span>
						<span className="italic">found</span>)
					</span>
					<span>
						<span className="throw">throw</span>
						<span className="italic">("(╯°□°)╯︵ ┻━┻");</span>
					</span>
					<span className="comment-404">
						//{" "}
						<a
							href="/"
							onClick={(e) => {
								e.preventDefault();
								navigate("/");
							}}
						>
							Go home!
						</a>
					</span>
				</Col>
			</Row>
		</Container>
	);
};

export default PageNotFound;
