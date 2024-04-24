import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	fetchCoinOrderBook,
	fetchCoinStats,
	fetchCoinTicker,
	fetchHistoricTrades,
	fetchProductCandles,
} from "../../redux/reducer/CoinbaseApi/CoinbaseApi";
import { Row, Col, Card, CardBody, Container, OverlayTrigger, Tooltip, Badge, CardText } from "react-bootstrap";
import { toast } from "react-toastify";
import TradingViewChart from "../Layout/ChartComponent";
import { formatNumber, formatVolume, calculatePriceChangePercentage } from "../../components/Tips/utility";
import FavoriteButton from "../Layout/FavoritesButtons";
import useUserRole from "../../hooks/useUserRole";
import saveToDatabase from "./saveTodb";
import { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import useSaveToDatabase from "../../hooks/saveToDatabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Layout/Loader";

const CoinDetail = ({ isSidebarOpen }) => {
	const { coinId } = useParams();
	const dispatch = useDispatch();
	const userId = useSelector((state) => state.login.user?.userId);
	const coins = useSelector((state) => state.coinbase.coins);
	const tickers = useSelector((state) => state.coinbase.tickers);
	const coinStats = useSelector((state) => state.coinbase.coinStats);
	const productCandles = useSelector((state) => state.coinbase.productCandles);
	const orderBooks = useSelector((state) => state.coinbase.orderBooks);
	const historicTrades = useSelector((state) => state.coinbase.historicTrades);
	const loading = useSelector((state) => state.coinbase.loading);
	const error = useSelector((state) => state.coinbase.error);
	const [formattedData, setFormattedData] = useState([]);
	const [selectedTimeRange, setSelectedTimeRange] = useState("1W");
	const { role, isLoading } = useUserRole();
	const news = useSelector((state) => state.news.news);
	const newsLoading = useSelector((state) => state.news.loading);
	const newsError = useSelector((state) => state.news.error);
	const [filteredNews, setFilteredNews] = useState([]);

	// Effettua il fetch dei dati al cambio di coinId o selectedTimeRange
	const fetchData = () => {
		if (coinId) {
			dispatch(fetchCoinTicker({ coinId }));
			dispatch(fetchCoinStats(coinId));
			fetchDataBasedOnTimeRange(selectedTimeRange);
			// Chiama altre azioni di fetch necessarie...
		}
	};

	useEffect(() => {
		fetchData(); // Chiama immediatamente fetchData al montaggio
		const intervalId = setInterval(fetchData, 60000); // Schedula fetchData per essere chiamata ogni minuto

		return () => clearInterval(intervalId); // Pulisci l'intervallo quando il componente viene smontato
	}, [coinId, selectedTimeRange, dispatch]);

	const fetchDataBasedOnTimeRange = (timeRange) => {
		let granularity;
		let startDate = new Date();
		let endDate = new Date();

		switch (timeRange) {
			case "1D":
				granularity = 300; // 5 minuti per 1 giorno
				startDate.setDate(endDate.getDate() - 1);
				break;
			case "1W":
			default:
				granularity = 3600; // 1 ora per 1 settimana
				startDate.setDate(endDate.getDate() - 7);
				break;
			case "1M":
				granularity = 86400; // 1 giorno per 1 mese
				startDate.setMonth(endDate.getMonth() - 1);
				break;
			case "3M":
				if (role === "Admin" || role === "Moderatore" || role === "UtentePro") {
					granularity = 86400; // 1 giorno per 3 mesi
					startDate.setMonth(endDate.getMonth() - 3);
				} else {
					return null;
				}
				break;
		}

		dispatch(
			fetchProductCandles({
				product_id: coinId,
				start: startDate.toISOString(),
				end: endDate.toISOString(),
				granularity,
			})
		);
		dispatch(fetchCoinOrderBook({ coinId }));
		dispatch(fetchHistoricTrades({ coinId }));
	};

	// Reagisce ai cambiamenti di productCandles per l'id della moneta corrente
	useEffect(() => {
		if (productCandles[coinId] && productCandles[coinId].length) {
			const candles = productCandles[coinId]
				.map((candle) => ({
					time: candle[0],
					low: candle[1],
					high: candle[2],
					open: candle[3],
					close: candle[4],
					volume: candle[5],
				}))
				.filter((candle) => candle != null)
				.sort((a, b) => a.time - b.time);
			setFormattedData(candles);
		}
	}, [productCandles, coinId, dispatch]);

	// Gestione degli errori
	useEffect(() => {
		if (error) {
			toast.error(`Errore: ${error}`);
		}
	}, [error]);

	if (loading && newsLoading) {
		return <div>Caricamento dei dettagli...</div>;
	} else if (error && newsError) {
		return <div>Errore nel caricamento dei dettagli: {error}</div>;
	}

	// Trova i dettagli della moneta nello stato coins
	const coinDetails = coins.find((coin) => coin.id === coinId) || {};
	// Prende i dettagli del ticker dallo stato tickers
	const tickerDetails = tickers[coinId] || {};
	const statsDetails = coinStats[coinId] || {};
	const orderBook = orderBooks[coinId] || {};
	const historicTrade = historicTrades[coinId] || {};
	// Combiniamo le informazioni dei dettagli della moneta e dei tickers
	const combinedCoinDetails = {
		...coinDetails,
		...tickerDetails,
		...statsDetails,
		...orderBook,
		...historicTrade,
	};
	const handleSaveToDb = useSaveToDatabase();

	const priceChangePercentage = coinStats[coinId]
		? calculatePriceChangePercentage(parseFloat(coinStats[coinId].open), parseFloat(coinStats[coinId].last))
		: null;
	const priceChangeColor = priceChangePercentage > 0 ? "text-success" : "text-danger";

	const calculateVariazione24h = (open, last) => {
		if (open && last) {
			return ((last - open) / open) * 100;
		}
		return null;
	};

	const baseCurrency = coinDetails.base_currency;
	// Utilizza useEffect per aggiornare le notizie filtrate quando cambiano le news o la base_currency.
	useEffect(() => {
		const newFilteredNews = news.filter((article) => {
			// Controlla se l'acronimo compare nel titolo, nel corpo o nei tag dell'articolo.
			const inTitle = article.title.toLowerCase().includes(baseCurrency.toLowerCase());
			const inBody = article.body.toLowerCase().includes(baseCurrency.toLowerCase());
			const inTags = article.tags.toLowerCase().includes(baseCurrency.toLowerCase());
			const inCategoris = article.categories.toLowerCase().includes(baseCurrency.toLowerCase());

			return inTitle || inBody || inTags || inCategoris;
		});

		setFilteredNews(newFilteredNews);
	}, [news, baseCurrency]);

	const saveDetails = () => handleSaveToDb(combinedCoinDetails);

	return (
		<Container>
			<Row>
				<Col>
					<Loader isLoading={isLoading || loading} />
					{combinedCoinDetails && (
						<Card className="border-0 mt-3">
							<CardBody>
								<Card.Title className="d-flex align-items-center justify-content-between">
									<div className="d-flex align-items-center gap-3">
										<h1 className="text-gold"> {combinedCoinDetails.base_currency} </h1>
										<span className={`ms-2 ${priceChangeColor}`}>{priceChangePercentage}%</span>
									</div>
									<div className="d-flex justify-content-between align-items-center gap-3">
										<h2 className="d-flex align-items-center m-0">{formatNumber(combinedCoinDetails.price)}</h2>
										<Badge className="bg-list p-1"> {coinDetails.quote_currency}</Badge>
										{coinDetails && (
											<FavoriteButton coinDetails={combinedCoinDetails} userId={userId} onSave={saveDetails} />
										)}
										<div>
											{(role === "Admin" || role === "Moderatore") && (
												<OverlayTrigger
													key="bottom"
													placement="bottom"
													overlay={<Tooltip id={`tooltip-bottom`}>Salva/Aggiorna coin nel DB</Tooltip>}
												>
													<div className="btn btn-sm btn-success text-white" onClick={saveDetails}>
														<FontAwesomeIcon icon={faUpload} />
													</div>
												</OverlayTrigger>
											)}
										</div>
										{/* Assicurati che combinedCoinDetails sia quello che vuoi salvare */}
									</div>
								</Card.Title>

								{/* TradingViewChart */}
								<TradingViewChart
									data={formattedData}
									onTimeRangeChange={setSelectedTimeRange}
									selectedTimeRange={selectedTimeRange}
									height={300}
									isSidebarOpen={isSidebarOpen}
									role={role}
								/>
								<h3 className="my-2">Dettagli aggiuntivi</h3>
								<div className="d-flex align-items-center justify-content-between mb-2">
									<Card.Text className="m-1 fw-semibold small-text">
										Max 24h: {formatNumber(combinedCoinDetails.high)} {coinDetails.quote_currency}
									</Card.Text>
									<Card.Text className="m-1 fw-semibold small-text">
										Min 24h: {formatNumber(combinedCoinDetails.low)} {coinDetails.quote_currency}
									</Card.Text>
									<Card.Text className="m-1 fw-semibold small-text">
										V 24h: {formatVolume(combinedCoinDetails.volume)} {coinDetails.quote_currency}
									</Card.Text>
									<Card.Text className="m-1 fw-semibold small-text">
										V 30g: {formatVolume(combinedCoinDetails.volume_30day)} {coinDetails.quote_currency}
									</Card.Text>
								</div>
							</CardBody>
						</Card>
					)}
					<h2 className="flex-center mt-5 text-white">
						{filteredNews.length === 0 ? "Non ci sono notizie inerenti alla coin" : `Notizie su ${coinId}`}
					</h2>
					<Row className="mb-2">
						{[...filteredNews].reverse().map((article, index) => (
							<Col xs={12} md={6} lg={4} key={index} className="g-2">
								<Card className="mb-3 border-0 h-100">
									<Card.Body className="d-flex flex-column align-items-start justify-content-between">
										<div className="d-flex align-items-center justify-content-start gap-2">
											<img
												src={article.source_info.img}
												alt={article.source_info.name}
												style={{ width: "45px", height: "45px" }}
											/>
											<h6>{article.source_info.name}</h6>
										</div>
										<Card.Img variant="top" src={article.imageurl} alt={article.title} />
										<Card.Title>{article.title}</Card.Title>
										<Card.Text className="truncate-multiline">{article.body}</Card.Text>
										<OverlayTrigger
											key="right"
											placement="right"
											overlay={<Tooltip id={`tooltip-bottom`}>Visualizza articolo</Tooltip>}
										>
											<a href={article.guid} target="_blank" rel="noopener noreferrer" className="a-news">
												{article.source}
											</a>
										</OverlayTrigger>
										<div className="text-light small-text">
											{article.tags.split("|").map((tag, tagIndex) => (
												<span key={tagIndex}>#{tag.trim()} </span>
											))}
										</div>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default CoinDetail;
