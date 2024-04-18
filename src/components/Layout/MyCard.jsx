import React, { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { formatNumber, calculatePriceChangePercentage } from "../../components/Tips/utility";
import FavoriteButton from "./FavoritesButtons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUpload } from "@fortawesome/free-solid-svg-icons";
import useUserRole from "../../hooks/useUserRole";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { fetchProductCandles } from "../../redux/reducer/CoinbaseApi/CoinbaseApi";

const candleDataCache = new Map();

const MyCard = React.memo(({ coin, currency, stats, onSave }) => {
	const { role, isLoading } = useUserRole();
	const navigate = useNavigate();
	const userId = useSelector((state) => state.login.user?.userId);
	const [candleData, setCandleData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchCandleData = async () => {
			// Prepara la data di inizio e fine per l'ultimo giorno
			const end = new Date();
			const start = new Date();
			start.setDate(end.getDate() - 1);

			if (candleDataCache.has(coin.id)) {
				setCandleData(candleDataCache.get(coin.id));
			} else {
				const action = await dispatch(
					fetchProductCandles({
						product_id: coin.id,
						start: start.toISOString(),
						end: end.toISOString(),
						granularity: 3600, // Granularità di 1 ora
					})
				);
				if (action.payload) {
					const formattedCandleData = action.payload.candles.map((candle) => ({
						time: candle[0], // timestamp
						value: candle[4], // close value
					}));
					candleDataCache.set(coin.id, formattedCandleData);
					setCandleData(formattedCandleData);
				}
			}
		};

		if (coin.id) {
			fetchCandleData();
		}
	}, [coin.id]);

	// Definizione dell'oggetto coinDetails
	const coinDetails = {
		id: coin?.id,
		base_currency: coin?.base_currency,
		last: stats?.last,
		open: stats?.open,
		volume: coin?.volume,
	};

	const priceChangePercentage =
		stats && typeof stats.last !== "undefined" && stats.open
			? calculatePriceChangePercentage(parseFloat(stats.open), parseFloat(stats.last))
			: null;
	const priceChangeColor = priceChangePercentage && priceChangePercentage > 0 ? "perc-success" : "perc-danger";

	if (!coin || !stats || isLoading) return null;

	const handleDetailsClick = () => navigate(`/coin/${coin.id}`);

	const saveCoinDetails = () => onSave(coinDetails);

	return (
		<div className="bg-all p-1">
			<Card className="rounded-0 other-card">
				<Card.Body>
					<Row className="d-flex">
						<Col md={12} lg={5} className="d-flex align-items-center justify-content-between gap-3">
							<Card.Title className="my-auto fs-6">{coin.display_name}</Card.Title>
							<Card.Text className={`fs-6 mx-2  my-auto ${priceChangeColor}`}>{priceChangePercentage}%</Card.Text>
							<ResponsiveContainer width="50%" height={30}>
								<LineChart data={candleData}>
									<Line type="monotone" dataKey="value" stroke="#f3f5d4" dot={false} />
									<YAxis domain={["dataMin", "dataMax"]} hide={true} />
								</LineChart>
							</ResponsiveContainer>
						</Col>
						<Col
							xs={12}
							md={5}
							lg={2}
							className="my-auto d-flex align-items-start justify-content-center flex-column my-auto"
						>
							<span className="d-inline-block">{formatNumber(coin.price, 2, 2)} </span> {currency}
						</Col>
						<Col
							xs={12}
							md={7}
							lg={5}
							className="d-flex justify-content-lg-around justify-content-end align-items-center gap-2"
						>
							{(role === "Admin" || role === "Moderatore") && (
								<OverlayTrigger
									key={`top + ${coin.id}`}
									trigger={["hover", "focus"]}
									placement="top"
									overlay={<Tooltip id={`tooltip-top`}>Salva/Aggiorna coin nel DB</Tooltip>}
								>
									<div className="btn btn-sm btn-success text-white  my-auto" onClick={saveCoinDetails}>
										<FontAwesomeIcon icon={faUpload} />
									</div>
								</OverlayTrigger>
							)}
							<OverlayTrigger
								key="top"
								trigger={["hover", "focus"]}
								placement="top"
								overlay={<Tooltip id={`tooltip-top`}>Dettagli coin</Tooltip>}
							>
								<div className="btn btn-transparent my-auto" onClick={handleDetailsClick}>
									<FontAwesomeIcon className="" icon={faChartLine} />
								</div>
							</OverlayTrigger>
							<FavoriteButton coinDetails={coinDetails} userId={userId} onSave={saveCoinDetails} />
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</div>
	);
});

export default MyCard;
