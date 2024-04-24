import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PostSkeleton = () => {
	return (
		<Row className="justify-content-center">
			<Col xs={12} md={7} className="mx-auto">
				<Card className="mb-4 post-card position-relative">
					<Card.Header className="d-flex align-items-center justify-content-between p-2">
						<div className="d-flex align-items-center gap-1">
							<div className="shimmer shimmer-avatar mr-2"></div>
							<div className="shimmer shimmer-title"></div>
						</div>
						<div className="shimmer shimmer-text ms-auto" style={{ width: "10%" }}></div>
					</Card.Header>
					<Card.Img variant="top" className="shimmer shimmer-image" />
					<Card.Body className="p-2">
						<div className="shimmer shimmer-text" style={{ width: "80%" }}></div>
						<div className="shimmer shimmer-text" style={{ width: "90%" }}></div>
						<div className="shimmer shimmer-text" style={{ width: "70%" }}></div>
					</Card.Body>
					<Card.Footer className="p-2">
						<div className="shimmer shimmer-text" style={{ width: "30%" }}></div>
					</Card.Footer>
				</Card>
			</Col>
		</Row>
	);
};

export default PostSkeleton;
