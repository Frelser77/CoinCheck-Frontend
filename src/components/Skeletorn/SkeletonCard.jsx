import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./skeleton.module.css";

const SkeletonCard = () => {
	return (
		<Card className="my-3">
			<Card.Body>
				<Row className="align-items-center justify-content-center">
					<Col xs={9} md={6} className="d-flex align-items-center justify-content-between gap-3">
						<div className={`${styles.skeletonTitle} mb-0`}></div>
						<div className={`${styles.skeletonPrice} mb-0`}></div>
					</Col>
					<Col md={2} className="d-none d-md-block">
						<div className={`${styles.skeletonBase}`}></div>
					</Col>
					<Col xs={3} md={4} className="d-flex justify-content-end align-items-center gap-3">
						<div className={`${styles.skeletonBtn} btn-transparent`}></div>
						<div className={`${styles.skeletonFav}`}></div>
						{/* <div className={`${styles.skeletonBtn} btn-transparent`}></div> */}
						<div className={`${styles.skeletonFav}`}></div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default SkeletonCard;
