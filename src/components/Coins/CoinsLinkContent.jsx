// CoinLinkContent.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { formatVolume } from "../Tips/utility";
import { CardTitle, Container, Col, Row, OverlayTrigger, Tooltip, CardText } from "react-bootstrap";
import Loader from "../Layout/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import UserInfoCard from "../Layout/UserInfo";

const CoinLinkContent = () => {
	const dispatch = useDispatch();
	const volumeSummary = useSelector((state) => state.volumeSummary.data);
	const isLoading = useSelector((state) => state.volumeSummary.loading);
	const error = useSelector((state) => state.volumeSummary.error);

	useEffect(() => {
		dispatch(fetchVolumeSummary());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			console.error(`Errore: ${error}`);
		}
	}, [error]);

	const onlineCoins = volumeSummary.filter((coin) => coin.id.endsWith("-USD") && !coin.id.startsWith("USD-"));

	const getTopVolatileCoins = (coins) => {
		if (!Array.isArray(coins)) {
			return [];
		}
		return coins
			.map((coin) => ({
				...coin,
				volume: parseFloat(coin.rfq_volume_24hour) || 0,
			}))
			.filter((coin) => coin.volume > 0)
			.sort((a, b) => b.volume - a.volume)
			.slice(0, 3);
	};

	const topVolatileCoins = getTopVolatileCoins(onlineCoins);

	return (
		<>
			<Loader isLoading={isLoading} />
			<Col
				md={3}
				className="d-none d-lg-block d-flex flex-column align-items-center justify-content-start volume-col gap-2 "
			>
				<Container>
					<Row>
						<Col className="mx-auto mt-4">
							<UserInfoCard />
							<Card className="text-center">
								<h2 className="">Monte più volatili</h2>
								{topVolatileCoins.length > 0 ? (
									topVolatileCoins.map((coin) => (
										<OverlayTrigger
											trigger={["hover", "focus"]}
											placement="left"
											key={`left + ${coin.id} + tooltip`}
											overlay={<Tooltip id="tooltip">Volumi di scambio</Tooltip>}
										>
											<ListGroup.Item key={coin.id}>
												<Link to={`/coin/${coin.id}`} style={{ textDecoration: "none" }}>
													<Card className="m-2 other-card">
														<Card.Body className="container">
															<Row>
																<Col xs={6}>
																	<CardTitle as="h6" className="text-gold">
																		{coin.display_name}
																	</CardTitle>
																</Col>
																<Col xs={2}>
																	<span className="fs-6">
																		<FontAwesomeIcon icon={faExchangeAlt} className="text-light" />
																	</span>
																</Col>
																<Col xs={4}>
																	<CardText className="text-gold">{formatVolume(coin.volume)}</CardText>
																</Col>
															</Row>
														</Card.Body>
													</Card>
												</Link>
											</ListGroup.Item>
										</OverlayTrigger>
									))
								) : (
									<p>Nessuna moneta da visualizzare.</p>
								)}
							</Card>
						</Col>
					</Row>
				</Container>
			</Col>
		</>
	);
};

export default CoinLinkContent;
