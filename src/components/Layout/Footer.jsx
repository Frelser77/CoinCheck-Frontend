import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

const year = new Date().getFullYear(); // Ottiene l'anno corrente

const Footer = () => {
	const timestamp = useSelector((state) => (state.login.user ? state.login.user.timestamp : null));
	const formattedDate = timestamp ? format(parseISO(timestamp), "HH:mm:ss - dd/MM/yyyy") : null;

	return (
		<footer className=" m-0 text-light">
			<Container fluid>
				<Row className="p-4">
					<Col
						xs={12}
						md={4}
						className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start"
					>
						<h5>CoinCheck</h5>
						<p>La tua guida nel mondo delle criptovalute.</p>
					</Col>
					<Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
						<ul className="list-unstyled">
							<li>
								<a href="/about" className="text-light">
									Chi siamo
								</a>
							</li>
							<li>
								<a href="/contact" className="text-light">
									Contattaci
								</a>
							</li>
							<li>
								<a href="/privacy" className="text-light">
									Privacy Policy
								</a>
							</li>
						</ul>
					</Col>
					<Col
						xs={12}
						md={4}
						className="d-flex flex-column justify-content-center justify-content-md-end align-items-end"
					>
						<h6>
							Ringraziamenti speciali a:
							<a
								href="https://developers.coinbase.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-light"
							>
								Coinbase API
							</a>
						</h6>
						<h6>
							<a
								href="https://tradingview.github.io/lightweight-charts/docs"
								target="_blank"
								rel="noopener noreferrer"
								className="text-light"
							>
								Lightweight Charts Documentation
							</a>
						</h6>
					</Col>
				</Row>

				<Row className="p-4">
					<Col xs={12} className="d-flex justify-content-center justify-content-md-between">
						<div className="d-flex justify-content-center justify-content-md-center">
							<a href="https://www.facebook.com/" className="text-light me-2" target="_blanck">
								<FontAwesomeIcon icon={faFacebookF} />
							</a>
							<a href="https://www.twitter.com/" className="text-light me-2" target="_blanck">
								<FontAwesomeIcon icon={faTwitter} />
							</a>
							<a
								href="https://github.com/yourusername/yourrepository"
								target="_blank"
								rel="noopener noreferrer"
								className="text-light"
							>
								<FontAwesomeIcon icon={faGithub} />
							</a>
						</div>

						{/* <div className="d-flex justify-content-center justify-content-md-center"> */}
						<h6>© {year} CoinCheck. Tutti i diritti riservati</h6>
						{/* </div> */}
						<p className="small-text text-light">Ultimo login: {formattedDate}</p>
					</Col>
				</Row>

				{/* <Row className="">
					<Col xs={12} className="d-flex justify-content-between align-items-center"></Col>
				</Row> */}
			</Container>
		</footer>
	);
};

export default Footer;
