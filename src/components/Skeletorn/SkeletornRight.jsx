import { Card, Col, Row } from "react-bootstrap";
import useHide from "../Tips/useHide";

const SkeletornRight = () => {
	const shouldHide = useHide(["/utentiList/", "/wallet"]);

	if (shouldHide) {
		return null;
	}

	return (
		<Col className="skeletorn-right d-none d-sm-block">
			<h1 className="text-start text">Seleziona un utente per modificare</h1>
			<div className="mt-4">
				<Card className="position-relative">
					<Row>
						{/* Esempio di scheletro per l'immagine dell'utente */}
						<Col md={5} className="p-4 d-flex align-items-center justify-content-center">
							<div className="skeleton-img"></div>
						</Col>
						{/* Esempio di scheletro per i dettagli dell'utente */}
						<Col md={7}>
							<Card.Body>
								<div className="skeleton-input"></div>
								<div className="skeleton-input"></div>
								<div className="skeleton-input"></div>
								<div className="skeleton-input"></div>
							</Card.Body>
						</Col>
					</Row>
				</Card>
			</div>
		</Col>
	);
};

export default SkeletornRight;
