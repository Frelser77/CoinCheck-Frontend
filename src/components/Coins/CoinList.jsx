import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoins, fetchCoinStats, fetchCoinTicker } from "../../redux/reducer/CoinbaseApi/CoinbaseApi";
import Card from "../Layout/MyCard";
import SkeletonCard from "../Skeletorn/SkeletonCard";
// import fetchNews, { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import useSaveToDatabase from "../../hooks/saveToDatabase";
import Loader from "../Layout/Loader";

const mainCoinIds = ["BTC-USD", "ETH-USD", "USDT-USD", "SOL-USD", "XRP-USD"];

const CryptoList = ({ showFavorites }) => {
	const dispatch = useDispatch();
	const coins = useSelector((state) => state.coinbase?.coins);
	const userPreferences = useSelector((state) => state.favorites?.userPreferences) || [];
	const tickers = useSelector((state) => state.coinbase?.tickers);
	const coinStats = useSelector((state) => state.coinbase?.coinStats);
	const isLoading = useSelector((state) => state.coinbase.loading);
	const handleSaveToDb = useSaveToDatabase();
	const loadMoreRef = useRef(null);

	const [loadedAll, setLoadedAll] = useState(false);
	const [visibleCoins, setVisibleCoins] = useState([]);
	const [visibleCoinIds, setVisibleCoinIds] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [loadingCoins, setLoadingCoins] = useState([]); // Traccia le monete attualmente in caricamento
	const allCoins = useSelector((state) => state.coinbase.coins);
	const [initialLoading, setInitialLoading] = useState(true);
	const [favoriteCoins, setFavoriteCoins] = useState([]);

	const onlineCoins = coins.filter(
		(coin) => coin.status === "online" && coin.id.endsWith("-USD") && !coin.id.startsWith("USD-")
	);

	useEffect(() => {
		if (!allCoins.length) {
			dispatch(fetchAllCoins());
		}
	}, [dispatch, allCoins]);

	useEffect(() => {
		if (showFavorites) {
			const favoriteCoins = coins
				.filter((coin) => userPreferences.some((pref) => pref.nomeCoin === coin.id))
				.slice(0, 10);
			setFavoriteCoins(favoriteCoins);
		}
	}, [showFavorites, userPreferences, coins]);

	useEffect(() => {
		if (showFavorites && favoriteCoins.length < userPreferences.length) {
			const nextFavoriteCoins = coins
				.filter((coin) => userPreferences.some((pref) => pref.nomeCoin === coin.id))
				.slice(favoriteCoins.length, favoriteCoins.length + 3);
			setFavoriteCoins((prevCoins) => [...prevCoins, ...nextFavoriteCoins]);
		}
	}, [showFavorites, userPreferences, coins, favoriteCoins]);

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
			setInitialLoading(false);
		};

		if (coins.length > 0) {
			loadInitialCoins();
		}
	}, [coins, dispatch]);
	const loadMoreCoins = useCallback(async () => {
		if (!isLoading && !fetching && visibleCoins.length < onlineCoins.length) {
			console.log("Inizio del caricamento di più monete...");
			setFetching(true);
			const newOnlineCoins = onlineCoins.filter((coin) => !visibleCoinIds.includes(coin.id));
			const nextCoins = newOnlineCoins.slice(0, 3);
			console.log("Nuove monete da caricare:", nextCoins);
			setLoadingCoins(nextCoins.map((coin) => coin.id));

			const fetchPromises = nextCoins.map((coin) => {
				dispatch(fetchCoinTicker({ coinId: coin.id }));
				return dispatch(fetchCoinStats(coin.id));
			});

			await Promise.all(fetchPromises);
			console.log("Monete caricate, aggiornamento dello stato...");
			setVisibleCoins((prevCoins) => {
				const updatedVisibleCoins = [...prevCoins, ...nextCoins];
				console.log("Stato aggiornato di visibleCoins:", updatedVisibleCoins);
				return updatedVisibleCoins;
			});
			setFetching(false);
			setLoadingCoins([]);
			setVisibleCoinIds((prevIds) => {
				const updatedVisibleCoinIds = [...prevIds, ...nextCoins.map((coin) => coin.id)];
				console.log("Stato aggiornato di visibleCoinIds:", updatedVisibleCoinIds);
				return updatedVisibleCoinIds;
			});
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
			{ threshold: 0.1 } // Configurazione soglia di intersezione
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

	const filteredCoins = showFavorites
		? coins.filter((coin) => userPreferences.some((pref) => pref.nomeCoin === coin.id))
		: null;

	const coinsToRender = showFavorites ? favoriteCoins : visibleCoins;
	console.log("Coins to render:", coinsToRender);

	return (
		<>
			<Loader isLoading={isLoading && initialLoading} />

			<div className="my-2 zone-5">
				{coinsToRender
					.filter((coin) => {
						// Se stiamo mostrando i preferiti, filtra solo le monete preferite
						if (showFavorites) {
							return userPreferences.some((pref) => pref.nomeCoin === coin.id);
						}
						// Altrimenti, mostra tutte le monete
						return true;
					})
					.map((coin) => {
						const coinId = coin.id;
						const coinDetails = coinStats[coinId];

						if (!coinDetails && showFavorites) {
							return null;
						}

						return (
							<Card
								coin={{ ...coin, ...tickers[coinId], ...coinDetails }}
								currency="USD"
								stats={coinDetails}
								key={`loaded-${coinId}`}
								onSave={handleSaveToDb}
							/>
						);
					})}
				{loadingCoins.map((id) => (
					<SkeletonCard key={`loading-${id}`} />
				))}
				{!loadedAll && !showFavorites && <div ref={loadMoreRef} style={{ height: "10px", marginTop: "50px" }}></div>}
			</div>
		</>
	);
};

export default CryptoList;
