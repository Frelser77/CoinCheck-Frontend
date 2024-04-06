// CoinLinkContent.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { formatVolume } from "../Tips/utility";
import { CardTitle, Col, Row } from "react-bootstrap";
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
			<Col xs={12} md={3} className="d-flex flex-column align-items-center justify-content-start volume-col gap-5">
				<UserInfoCard />

				<Card className="px-2 pt-2 text-center ">
					<h2 className="">Monte più volatili</h2>
					{topVolatileCoins.length > 0 ? (
						topVolatileCoins.map((coin) => (
							<ListGroup.Item key={coin.id}>
								<Link to={`/coin/${coin.id}`} style={{ textDecoration: "none" }}>
									<Card className="m-2 other-card">
										<Card.Body className="container">
											<Row>
												<Col xs={6}>
													<CardTitle as="h6">{coin.display_name}</CardTitle>
												</Col>
												<Col xs={2}>
													<span className="fs-6">
														<FontAwesomeIcon icon={faExchangeAlt} />
													</span>
												</Col>
												<Col xs={4}>{formatVolume(coin.volume)}</Col>
											</Row>
										</Card.Body>
									</Card>
								</Link>
							</ListGroup.Item>
						))
					) : (
						<p>Nessuna moneta da visualizzare.</p>
					)}
				</Card>
			</Col>
		</>
	);
};

export default CoinLinkContent;
