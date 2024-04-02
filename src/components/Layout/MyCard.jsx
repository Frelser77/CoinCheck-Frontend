import React from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { formatNumber, calculatePriceChangePercentage } from "../../components/Tips/utility";
import FavoriteButton from "./FavoritesButtons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUpload } from "@fortawesome/free-solid-svg-icons";
import useUserRole from "../../hooks/useUserRole";
import { useSelector } from "react-redux";

const MyCard = ({ coin, currency, stats, onSave }) => {
	const { role, isLoading } = useUserRole();
	const navigate = useNavigate();
	const userId = useSelector((state) => state.login.user?.userId);

	// Definizione dell'oggetto coinDetails nel corpo del componente
	const coinDetails = {
		id: coin.id,
		base_currency: coin.base_currency,
		last: stats.last,
		open: stats.open,
		volume: coin.volume,
	};
	// console.log("coindetails", coinDetails);
	// console.log("stats", stats);

	const priceChangePercentage = stats
		? calculatePriceChangePercentage(parseFloat(stats.open), parseFloat(stats.last))
		: null;
	const priceChangeColor = priceChangePercentage && priceChangePercentage > 0 ? "text-success" : "text-danger";

	if (!coin || !stats || isLoading) return null;

	const handleDetailsClick = () => navigate(`/coin/${coin.id}`);

	const saveCoinDetails = () => onSave(coinDetails);
	// console.log("saveCoinDetails", coinDetails);

	return (
		<Card className="rounded-0">
			<Card.Body>
				<Row className="">
					<Col xs={9} md={8} className="d-flex align-items-center justify-content-between gap-3">
						<Card.Title className="mb-2">{coin.display_name}</Card.Title>
						<Card.Text className={`fs-6 mx-2 ${priceChangeColor}`}>{priceChangePercentage}%</Card.Text>
						<span className="mx-2">{formatNumber(coin.price, 2, 2)} </span> {/*{currency}*/}{" "}
					</Col>
					{/* <Col md={2} className="d-xs-none d-md-block"> */}
					{/* <Card.Text className="mb-0">{coin.base_currency}</Card.Text> */}
					{/* </Col> */}
					<Col xs={3} md={4} className="d-flex justify-content-end align-items-baseline gap-2">
						{(role === "Admin" || role === "Moderatore") && (
							<OverlayTrigger
								key={`top + ${coin.id}`}
								placement="top"
								overlay={<Tooltip id={`tooltip-top`}>Salva/Aggiorna coin nel DB</Tooltip>}
							>
								<div className="btn btn-sm btn-success text-white" onClick={saveCoinDetails}>
									<FontAwesomeIcon icon={faUpload} />
								</div>
							</OverlayTrigger>
						)}
						{/* <SaveCoinButton coin={coin} coinStats={stats} /> */}
						<OverlayTrigger key="top" placement="top" overlay={<Tooltip id={`tooltip-top`}>Dettagli coin</Tooltip>}>
							<div className="btn btn-transparent" onClick={handleDetailsClick}>
								<FontAwesomeIcon className="" icon={faChartLine} />
							</div>
						</OverlayTrigger>
						<FavoriteButton coinDetails={coinDetails} userId={userId} onSave={saveCoinDetails} />
					</Col>
				</Row>
			</Card.Body>
		</Card>
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
