import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="mt-3 bg-dark sticky-bottom">
			{/* <Container>
				<Row> */}
			<Col className="d-flex justify-content-center align-items-center">
				<p className=" text-light">© {year} CoinCheck. All Rights Reserved</p>
			</Col>
			{/* </Row>
			</Container> */}
		</footer>
	);
};

export default Footer;
