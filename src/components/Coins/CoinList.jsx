import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoins, fetchCoinStats, fetchCoinTicker } from "../../redux/reducer/CoinbaseApi/CoinbaseApi";
import Card from "../Layout/MyCard";
import SkeletonCard from "../Skeletorn/SkeletonCard";
// import fetchNews, { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import useSaveToDatabase from "../../hooks/saveToDatabase";
import Loader from "../Layout/Loader";

const mainCoinIds = [
	"BTC-USD",
	"ETH-USD",
	"USDT-USD",
	"SOL-USD",
	"XRP-USD",
	// Altre monete commentate
];

const CryptoList = () => {
	const dispatch = useDispatch();
	const coins = useSelector((state) => state.coinbase.coins);
	const tickers = useSelector((state) => state.coinbase.tickers);
	const coinStats = useSelector((state) => state.coinbase.coinStats);
	const isLoading = useSelector((state) => state.coinbase.loading);
	const handleSaveToDb = useSaveToDatabase();

	const [loadedAll, setLoadedAll] = useState(false);
	const [visibleCoins, setVisibleCoins] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [loadingCoins, setLoadingCoins] = useState([]); // Traccia le monete attualmente in caricamento
	const allCoins = useSelector((state) => state.coinbase.coins);

	const onlineCoins = coins.filter(
		(coin) => coin.status === "online" && coin.id.endsWith("-USD") && !coin.id.startsWith("USD-")
	);

	useEffect(() => {
		if (!allCoins.length) {
			dispatch(fetchAllCoins());
		}
	}, [dispatch, allCoins]);

	useEffect(() => {
		const loadInitialCoins = async () => {
			setLoadingCoins(mainCoinIds); // Imposta tutte le monete principali come in caricamento
			const fetchPromises = mainCoinIds.map((coinId) => {
				dispatch(fetchCoinTicker({ coinId }));
				return dispatch(fetchCoinStats(coinId));
			});

			await Promise.all(fetchPromises);

			// Mappa su mainCoinIds per mantenere l'ordine delle monete principali
			const initialCoins = mainCoinIds
				.map((id) => coins.find((coin) => coin.id === id && coin.status === "online"))
				.filter(Boolean);
			setVisibleCoins(initialCoins);
			setLoadingCoins([]); // Pulisce lo stato di caricamento dopo il fetch
		};

		if (coins.length > 0) {
			loadInitialCoins();
		}
	}, [coins, dispatch]);

	const loadMoreCoins = useCallback(async () => {
		if (!isLoading && !fetching && visibleCoins.length < onlineCoins.length) {
			setFetching(true);
			const nextCoins = onlineCoins.slice(visibleCoins.length, visibleCoins.length + 3);
			setLoadingCoins(nextCoins.map((coin) => coin.id));

			const fetchPromises = nextCoins.map((coin) => {
				dispatch(fetchCoinTicker({ coinId: coin.id }));
				return dispatch(fetchCoinStats(coin.id));
			});

			await Promise.all(fetchPromises);
			setVisibleCoins((prevCoins) => [...prevCoins, ...nextCoins]);
			setFetching(false);
			setLoadingCoins([]);
		}
	}, [isLoading, fetching, visibleCoins, onlineCoins, dispatch]);

	useEffect(() => {
		setLoadedAll(visibleCoins.length >= onlineCoins.length);
	}, [visibleCoins, onlineCoins]);

	return (
		<>
			<Loader isLoading={isLoading} />

			<div className="mt-4 zone-1">
				{visibleCoins.map((coin) => (
					<Card
						coin={{ ...coin, ...tickers[coin.id] }}
						currency="EUR"
						stats={coinStats[coin.id]}
						key={coin.id}
						onSave={handleSaveToDb}
					/>
				))}
				{loadingCoins.map((id) => (
					<SkeletonCard key={id} />
				))}
				{!loadedAll && (
					<div className="btn btn-primary" onClick={loadMoreCoins} disabled={isLoading || fetching}>
						Mostra altro
					</div>
				)}
			</div>
		</>
	);
};

export default CryptoList;
