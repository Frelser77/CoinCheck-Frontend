import { useEffect, useState, useCallback, useRef } from "react";
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
	const loadMoreRef = useRef(null);

	const [loadedAll, setLoadedAll] = useState(false);
	const [visibleCoins, setVisibleCoins] = useState([]);
	const [visibleCoinIds, setVisibleCoinIds] = useState([]);
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
			setLoadingCoins([]);
			setVisibleCoinIds(mainCoinIds);
		};

		if (coins.length > 0) {
			loadInitialCoins();
		}
	}, [coins, dispatch]);

	const loadMoreCoins = useCallback(async () => {
		if (!isLoading && !fetching && visibleCoins.length < onlineCoins.length) {
			setFetching(true);
			const newOnlineCoins = onlineCoins.filter((coin) => !visibleCoinIds.includes(coin.id));
			const nextCoins = newOnlineCoins.slice(0, 3);
			setLoadingCoins(nextCoins.map((coin) => coin.id));

			const fetchPromises = nextCoins.map((coin) => {
				dispatch(fetchCoinTicker({ coinId: coin.id }));
				return dispatch(fetchCoinStats(coin.id));
			});

			await Promise.all(fetchPromises);
			setVisibleCoins((prevCoins) => [...prevCoins, ...nextCoins]);
			setFetching(false);
			setLoadingCoins([]);
			setVisibleCoinIds((prevIds) => [...prevIds, ...nextCoins.map((coin) => coin.id)]);
		}
	}, [isLoading, fetching, visibleCoins, onlineCoins, dispatch]);

	useEffect(() => {
		setLoadedAll(visibleCoins.length >= onlineCoins.length);
	}, [visibleCoins, onlineCoins]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading && !fetching && !loadedAll) {
					loadMoreCoins();
				}
			},
			{ threshold: 0.1 } // Configura la soglia di intersezione qui se necessario
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}
		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [loadMoreCoins, isLoading, fetching, loadedAll]);

	return (
		<>
			<Loader isLoading={isLoading} />

			<div className="my-2 zone-5">
				{visibleCoins.map((coin) => (
					<Card
						coin={{ ...coin, ...tickers[coin.id] }}
						currency="USD"
						stats={coinStats[coin.id]}
						key={`loaded-${coin.id}`}
						onSave={handleSaveToDb}
					/>
				))}
				{loadingCoins.map((id) => (
					<SkeletonCard key={`loading-${id}`} />
				))}
				{!loadedAll && (
					// <div className="btn btn-primary" onClick={loadMoreCoins} disabled={isLoading || fetching}>
					// 	Mostra altro
					// </div>
					<div ref={loadMoreRef} style={{ height: "10px", marginTop: "50px" }}></div>
				)}
			</div>
		</>
	);
};

export default CryptoList;
