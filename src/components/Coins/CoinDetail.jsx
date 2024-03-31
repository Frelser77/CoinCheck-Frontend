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
import { Row, Col, Card, CardBody, Button, Modal, OverlayTrigger, Tooltip, Badge, CardText } from "react-bootstrap";
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

const CoinDetail = () => {
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
				granularity = 86400; // 1 giorno per 3 mesi
				startDate.setMonth(endDate.getMonth() - 3);
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
	console.log(combinedCoinDetails);
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
		<>
			<Loader isLoading={isLoading || loading} />
			{combinedCoinDetails && (
				<Card className="border-0">
					<CardBody>
						<Card.Title className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center gap-3">
								<h1> {combinedCoinDetails.base_currency} </h1>
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

						{/* Altre informazioni essenziali se necessario */}
						<TradingViewChart
							data={formattedData}
							onTimeRangeChange={setSelectedTimeRange}
							selectedTimeRange={selectedTimeRange}
							width={650}
							height={300}
						/>
					</CardBody>
				</Card>
			)}
			<Card className="border-0">
				<h3>Dettagli aggiuntivi</h3>
				<CardBody className="d-flex align-items-center justify-content-between">
					<CardText className="m-1 fw-semibold small-text">
						Max 24h: {formatNumber(combinedCoinDetails.high)}
						{coinDetails.quote_currency}
					</CardText>
					<CardText className="m-1 fw-semibold small-text">
						Min 24h: {formatNumber(combinedCoinDetails.low)}
						{coinDetails.quote_currency}
					</CardText>
					<CardText className="m-1 fw-semibold small-text">
						V 24h: {formatVolume(combinedCoinDetails.volume)} {coinDetails.quote_currency}
					</CardText>
					<CardText className="m-1 fw-semibold small-text">
						V 30g: {formatVolume(combinedCoinDetails.volume_30day)} {coinDetails.quote_currency}
					</CardText>
				</CardBody>
			</Card>
			<Row>
				<h2 className="text-center my-5">Notizie su {coinId}</h2>
				{filteredNews.map((article, index) => (
					<Col xs={12} md={6} lg={4} key={index} className="gap-2">
						<Card className="mb-3 border-0 h-100">
							<div className="d-flex align-items-start justify-content-start gap-2">
								<img
									src={article.source_info.img}
									alt={article.source_info.name}
									style={{ width: "25px", height: "25px" }}
								/>
								<h6>{article.source_info.name}</h6>
							</div>
							<Card.Body className="d-flex flex-column align-items-start justify-content-between">
								<Card.Img variant="top" src={article.imageurl} alt={article.title} />
								<Card.Title>{article.title}</Card.Title>
								<Card.Text className="truncate-multiline">{article.body}</Card.Text>
								<a href={article.guid} target="_blank" rel="noopener noreferrer">
									{article.source}
								</a>
								<div className="text-muted">
									{article.tags.split("|").map((tag, tagIndex) => (
										<span key={tagIndex}>#{tag.trim()} </span>
									))}
								</div>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default CoinDetail;
// const calculateVolumeDifference = (historicTrades) => {
// 	let totalBuyVolume = 0;
// 	let totalSellVolume = 0;

// 	historicTrades.forEach((trade) => {
// 		const size = parseFloat(trade.size);
// 		if (trade.side === "buy") {
// 			totalBuyVolume += size;
// 		} else if (trade.side === "sell") {
// 			totalSellVolume += size;
// 		}
// 	});

// 	return totalBuyVolume - totalSellVolume;
// };

// // Esegui i calcoli nel posto giusto con le giuste dipendenze
// useEffect(() => {
// 	if (historicTrades[coinId] && historicTrades[coinId].length) {
// 		const volumeDifference = calculateVolumeDifference(historicTrades[coinId]);
// 		const result = `La differenza di volume è: ${volumeDifference.toFixed(2)} ed è ${
// 			volumeDifference < 0 ? "negativa" : "positiva"
// 		}`;
// 		console.log(result);
// 		// Se vuoi aggiungere il colore al testo per la visualizzazione in console
// 		console.log(`%c${result}`, `color: ${volumeDifference < 0 ? "red" : "green"}`);
// 	}
// }, [historicTrades, coinId]);

// const handleSaveToDb = () => {
// 	// Estrapola i dati necessari dallo stato Redux o da variabili locali
// 	// const stats = coinStats[coinId] || {};
// 	// const ticker = tickers[coinId] || {};

// 	// Crea il DTO utilizzando i dati raccolti
// 	const criptovalutaDto = {
// 		Nome: coinId, // Ad esempio, 'BTC-USD'
// 		Simbolo: combinedCoinDetails.base_currency, // Ad esempio, 'BTC'
// 		PrezzoUsd: combinedCoinDetails.last ? parseFloat(combinedCoinDetails.last) : null,
// 		Variazione24h: calculateVariazione24h(parseFloat(combinedCoinDetails.open), parseFloat(combinedCoinDetails.last)),
// 		Volume24h: combinedCoinDetails.volume ? parseFloat(combinedCoinDetails.volume) : null,
// 	};
// 	console.log("dto", criptovalutaDto);
// 	// Chiama la funzione saveToDatabase passando il DTO
// 	saveToDatabase(criptovalutaDto)
// 		.then(() => {
// 			// Gestisci qui la risposta del salvataggio, ad esempio mostrando un messaggio di successo o errore
// 			console.log(`Dati della criptovaluta con id ${coinId} salvati con successo nel database.`);
// 		})
// 		.catch((error) => {
// 			// Gestisci qui eventuali errori nell'invio dei dati
// 			console.error(`Errore nel salvataggio della criptovaluta con id ${coinId}:`, error);
// 		});

// useEffect(() => {
// 	if (coinId) {
// 		// Supponiamo che il tuo endpoint non supporti la ricerca per coinId,
// 		// quindi semplicemente richiediamo le ultime notizie senza filtrare per coinId.
// 		// Se il tuo endpoint supporta filtri, modifica la chiamata di seguito.
// 		dispatch(fetchCryptoNews());
// 	}
// }, [coinId, dispatch]);
// };
