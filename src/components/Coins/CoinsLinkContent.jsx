// CoinLinkContent.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { formatVolume } from "../Tips/utility";
import { CardTitle, Col } from "react-bootstrap";
import Loader from "../Layout/Loader";

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

			<Col className="d-flex align-items-start justify-content-center">
				<Card className="lg-position-fixed right-0 border-0 bg-transparent rounded-0">
					<h2 className="">Monte più volatili</h2>
					{topVolatileCoins.length > 0 ? (
						topVolatileCoins.map((coin) => (
							<ListGroup.Item key={coin.id}>
								<Link to={`/coin/${coin.id}`} style={{ textDecoration: "none" }}>
									<Card className="rounded-0">
										<CardTitle className="text-center" as="h5">
											{coin.display_name}
										</CardTitle>
										<Card.Body>
											<Card.Title>Volume 24h: {formatVolume(coin.volume)}</Card.Title>
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
