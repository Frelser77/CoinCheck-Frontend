// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CoinCard from "../Layout/MyCard";
// import { formatNumber, calculatePriceChangePercentage, formatVolume } from "../Tips/utility";
// import { fetchCoinsDetails } from "./coinbaseApiService";
// import { fetchAllCoins } from "../../redux/reducer/CoinbaseApi/CoinbaseApi";
// import { toast } from "react-toastify";
// import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";
// import { Card, CardBody, Col, Row } from "react-bootstrap";
// import FavoriteButton from "../Layout/FavoritesButtons";

// const CryptoDashboard = () => {
// 	const dispatch = useDispatch();
// 	const [visibleCoinIDs, setVisibleCoinIDs] = useState([]);
// 	const [detailsLoaded, setDetailsLoaded] = useState(false);

// 	// Il tuo stato redux aggiornato
// 	const coins = useSelector((state) => state.coinbase.coins);
// 	const tickers = useSelector((state) => state.coinbase.tickers);
// 	const coinStats = useSelector((state) => state.coinbase.coinStats);
// 	const orderBooks = useSelector((state) => state.coinbase.orderBooks);
// 	const historicTrades = useSelector((state) => state.coinbase.historicTrades);
// 	const coinsLoading = useSelector((state) => state.coinbase.loading);
// 	const volumeSummary = useSelector((state) => state.coinbase.volumeSummary);

// 	// Caricamento iniziale dei dati delle monete, se non è già stato fatto
// 	useEffect(() => {
// 		// Questo effect si attiva una volta al montaggio del componente
// 		const loadData = async () => {
// 			try {
// 				await dispatch(fetchAllCoins());
// 				await dispatch(fetchVolumeSummary());
// 			} catch (error) {
// 				toast.error("Errore nel caricamento delle monete: " + error.message);
// 			}
// 		};

// 		if (coins.length === 0) {
// 			loadData();
// 		}
// 	}, [dispatch, coins.length]);

// 	useEffect(() => {
// 		// Imposta i primi 5 IDs delle monete come visibili
// 		setVisibleCoinIDs(coins.slice(0, 5).map((coin) => coin.id));
// 	}, [coins]);

// 	useEffect(() => {
// 		// Carica i dettagli per gli IDs visibili
// 		const loadDetails = async () => {
// 			try {
// 				for (const id of visibleCoinIDs) {
// 					await dispatch(fetchCoinsDetails(id));
// 				}
// 				setDetailsLoaded(true);
// 			} catch (error) {
// 				toast.error("Errore nel caricamento dei dettagli delle monete: " + error.message);
// 			}
// 		};

// 		if (visibleCoinIDs.length > 0 && !detailsLoaded) {
// 			loadDetails();
// 		}
// 	}, [dispatch, visibleCoinIDs, detailsLoaded]);

// 	const loadMoreCoinDetails = async (newCoinIDs) => {
// 		await dispatch(fetchCoinsDetails(newCoinIDs));
// 	};

// 	// Carica i dettagli delle monete visibili
// 	useEffect(() => {
// 		if (!detailsLoaded && visibleCoinIDs.length > 0) {
// 			visibleCoinIDs.forEach((coinId) => {
// 				dispatch(fetchCoinsDetails(coinId)); // Assicurati che questa action carichi i dettagli per una specifica moneta
// 			});
// 			setDetailsLoaded(true);
// 		}
// 	}, [dispatch, visibleCoinIDs, detailsLoaded]);

// 	const loadMoreCoins = () => {
// 		const moreCoinIDs = coins
// 			.filter((coin) => coin.status === "online" && coin.id.endsWith("-USD") && !coin.id.startsWith("USD-"))
// 			.slice(visibleCoinIDs.length, visibleCoinIDs.length + 10)
// 			.map((coin) => coin.id);

// 		if (moreCoinIDs.length > 0) {
// 			loadMoreCoinDetails(moreCoinIDs);
// 		}
// 	};

// 	if (coinsLoading) {
// 		return <div>Caricamento...</div>;
// 	}
// 	const combineDetails = (coinId) => {
// 		const coin = coins.find((c) => c.id === coinId) || {};
// 		const ticker = tickers[coinId] || {};
// 		const stats = coinStats[coinId] || {};
// 		const orderBook = orderBooks[coinId] || {};
// 		const historicTrade = historicTrades[coinId] || {};
// 		const volume = volumeSummary || {}; // Assicurati che questa sia la struttura corretta

// 		return {
// 			...coin,
// 			...ticker,
// 			...stats,
// 			...orderBook,
// 			...historicTrade,
// 			...volume,
// 		};
// 	};

// 	console.log(combineDetails("BTC-USD"));
// 	if (coinsLoading) {
// 		return <div>Caricamento...</div>;
// 	}

// 	const handleSaveToDb = (coinId) => {
// 		const combinedDetails = combineDetails(coinId); // Ora usiamo la funzione corretta
// 		const criptovalutaDto = {
// 			Nome: coinId,
// 			Simbolo: combinedDetails.base_currency,
// 			PrezzoUsd: combinedDetails.last ? parseFloat(combinedDetails.last) : null,
// 			Variazione24h: calculateVariazione24h(parseFloat(combinedDetails.open), parseFloat(combinedDetails.last)),
// 			Volume24h: combinedDetails.volume ? parseFloat(combinedDetails.volume) : null,
// 		};
// 		console.log(criptovalutaDto);
// 		// Chiama la funzione saveToDatabase passando il DTO
// 		saveToDatabase(criptovalutaDto)
// 			.then(() => {
// 				// Gestisci qui la risposta del salvataggio, ad esempio mostrando un messaggio di successo o errore
// 				console.log(`Dati della criptovaluta con id ${coinId} salvati con successo nel database.`);
// 			})
// 			.catch((error) => {
// 				// Gestisci qui eventuali errori nell'invio dei dati
// 				console.error(`Errore nel salvataggio della criptovaluta con id ${coinId}:`, error);
// 			});
// 	};

// 	console.log(combineDetails("BTC-USD"));
// 	return (
// 		<div className="crypto-dashboard">
// 			{visibleCoinIDs.map((coinId) => {
// 				const combinedDetails = combineDetails(coinId);
// 				const priceChangePercentage = calculatePriceChangePercentage(
// 					parseFloat(combinedDetails.open),
// 					parseFloat(combinedDetails.last)
// 				);
// 				const priceChangeColor = priceChangePercentage > 0 ? "text-success" : "text-danger";

// 				return (
// 					<Row key={coinId} className="justify-content-md-center">
// 						<Col md={8}>
// 							{/* <TimeRangeSelector onChange={handleTimeRangeChange} /> */}
// 							<Card className="border-0">
// 								<div className="admin-dropdown">
// 									<button onClick={() => handleSaveToDb(coinId)}>Carica nel DB</button>
// 									{/* Puoi aggiungere altre azioni amministrative qui */}
// 								</div>
// 								<CardBody>
// 									<Card.Title className="d-flex align-items-center justify-content-between">
// 										<div className="d-flex align-items-center gap-3">
// 											<h1> {combinedDetails.base_currency} </h1>
// 											<span className={`ms-2 ${priceChangeColor}`}>{formatNumber(priceChangePercentage)}%</span>
// 										</div>
// 										<span className="me-4 align-items-baseline">
// 											<span> {formatNumber(combinedDetails.price)} </span>
// 											<span> {combinedDetails.quote_currency}</span>
// 											<FavoriteButton />
// 										</span>
// 									</Card.Title>
// 									{/* Altre informazioni essenziali se necessario */}
// 								</CardBody>
// 							</Card>
// 							<div>
// 								<h3>Dettagli aggiuntivi</h3>
// 								<div className="d-flex align-items-center justify-content-between">
// 									<p>
// 										Max 24h: {formatNumber(combinedDetails.high)}
// 										{combinedDetails.quote_currency}
// 									</p>
// 									<p>
// 										Min 24h: {formatNumber(combinedDetails.low)}
// 										{combinedDetails.quote_currency}
// 									</p>
// 									<p>
// 										V 24h: {formatVolume(combinedDetails.volume)} {combinedDetails.quote_currency}
// 									</p>
// 									{/* E così via per gli altri dettagli che desideri mostrare */}
// 								</div>
// 							</div>
// 						</Col>
// 					</Row>
// 				);
// 			})}
// 			<button onClick={loadMoreCoins} disabled={coinsLoading || detailsLoaded}>
// 				Mostra altro
// 			</button>
// 		</div>
// 	);
// };

// export default CryptoDashboard;
