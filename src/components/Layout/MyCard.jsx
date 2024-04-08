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

const MyCard = ({ coin, currency, stats, onSave }) => {
	const { role, isLoading } = useUserRole();
	const navigate = useNavigate();
	const userId = useSelector((state) => state.login.user?.userId);
	const [candleData, setCandleData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (coin.id) {
			// Prepara la data di inizio e fine per l'ultimo giorno
			const end = new Date();
			const start = new Date();
			start.setDate(end.getDate() - 1);

			dispatch(
				fetchProductCandles({
					product_id: coin.id,
					start: start.toISOString(),
					end: end.toISOString(),
					granularity: 3600, // Granularità di 1 ora
				})
			).then((action) => {
				if (action.payload) {
					// Assumi che i dati delle candele siano nel payload
					setCandleData(
						action.payload.candles.map((candle) => ({
							time: candle[0], // timestamp
							value: candle[4], // close value
						}))
					);
				}
			});
		}
	}, [coin.id, dispatch]);

	// Definizione dell'oggetto coinDetails nel corpo del componente
	const coinDetails = {
		id: coin.id,
		base_currency: coin.base_currency,
		last: stats.last,
		open: stats.open,
		volume: coin.volume,
	};

	const priceChangePercentage = stats
		? calculatePriceChangePercentage(parseFloat(stats?.open), parseFloat(stats?.last))
		: null;

	const priceChangeColor = priceChangePercentage && priceChangePercentage > 0 ? "perc-success" : "perc-danger";

	if (!coin || !stats || isLoading) return null;

	const handleDetailsClick = () => navigate(`/coin/${coin.id}`);

	const saveCoinDetails = () => onSave(coinDetails);

	return (
		<div className="bg-all p-1">
			<Card className="rounded-0 other-card">
				<Card.Body>
					<Row className="">
						<Col xs={12} md={5} className="d-flex align-items-center justify-content-between gap-3">
							<Card.Title className="my-auto fs-6">{coin.display_name}</Card.Title>
							<Card.Text className={`fs-6 mx-2  my-auto ${priceChangeColor}`}>{priceChangePercentage}%</Card.Text>
							<ResponsiveContainer width="50%" height={30}>
								<LineChart data={candleData}>
									<Line type="monotone" dataKey="value" stroke="#f3f5d4" dot={false} />
									<YAxis domain={["dataMin", "dataMax"]} hide={true} />
								</LineChart>
							</ResponsiveContainer>
						</Col>
						<Col xs={12} md={2} className="text-center my-auto">
							<span className="mx-2">{formatNumber(coin.price, 2, 2)} </span> {currency}
						</Col>
						<Col xs={12} md={5} className="d-flex justify-content-around align-items-center gap-2">
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
};

export default MyCard;

{
	/* <div className="d-flex justify-content-between align-items-center"> */
}
{
	/* <Card.Text className="mb-0">Volume: {formatVolume(coin.volume)}</Card.Text> */
}
{
	/* </div> */
}
{
	/* <div className="d-flex justify-content-between align-items-center mt-3">
	<Card.Text className="mb-0">Ultimo Trade Size: {formatNumber(coin.size, 6)}</Card.Text>
	<Card.Text className="mb-0">
	{coin.time && `Ultimo Trade Time: ${new Date(coin.time).toLocaleString()}`}
	</Card.Text>
</div> */
}
