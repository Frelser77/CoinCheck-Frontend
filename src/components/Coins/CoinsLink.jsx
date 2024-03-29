import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { formatVolume } from "../Tips/utility";

const CoinLink = () => {
	const dispatch = useDispatch();
	const volumeSummary = useSelector((state) => state.volumeSummary.data);
	const loading = useSelector((state) => state.volumeSummary.loading);
	const error = useSelector((state) => state.volumeSummary.error);

	useEffect(() => {
		dispatch(fetchVolumeSummary());
	}, [dispatch]);
	useEffect(() => {
		if (error) {
			console.error(`Errore: ${error}`);
		}
	}, [error]);
	const getTopVolatileCoins = (coins) => {
		if (!Array.isArray(coins)) {
			return [];
		}
		return coins
			.map((coin) => ({
				...coin,
				volume: parseFloat(coin.rfq_volume_24hour) || 0, // Usa rfq_volume_24hour invece di spot_volume_24hour
			}))
			.filter((coin) => coin.volume > 0) // Filtra per volume maggiore di 0
			.sort((a, b) => b.volume - a.volume) // Ordina in base al volume
			.slice(0, 3); // Prende le prime tre monete con volume più alto
	};

	// Poi nel componente...
	const topVolatileCoins = getTopVolatileCoins(volumeSummary);

	return (
		<>
			{loading ? (
				<p>Caricamento...</p>
			) : (
				<Card className="position-fixed roght-0 border-0">
					<h2>Monte più volatili</h2>
					{topVolatileCoins.length > 0 ? (
						topVolatileCoins.map((coin) => (
							<ListGroup.Item key={coin.id}>
								<Link to={`/coin/${coin.id}`} style={{ textDecoration: "none" }}>
									<Card>
										<Card.Header as="h5">{coin.display_name}</Card.Header>
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
			)}
		</>
	);
};

export default React.memo(CoinLink);
