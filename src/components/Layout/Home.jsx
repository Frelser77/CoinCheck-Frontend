import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
// import CoinsFetcher from "./CoinList";
import CryptoList from "../Coins/CoinList";
import SideBarLeft from "./SideBarLeft";
import CoinsLink from "../Coins/CoinsLink";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import HomeCarousel from "./HomeCarousel";
import { loadUserPreferences } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import WalletCard from "./WalletCard";
// import CoinLink from "../Coins/CoinsLink";
const Home = () => {
	const news = useSelector((state) => state.news.news);
	const userId = useSelector((state) => state.login.user?.userId);
	// console.log(news);
	const dispatch = useDispatch();

	useEffect(() => {
		if (userId) {
			dispatch(loadUserPreferences(userId));
		} else {
			// Qui potresti gestire cosa succede se userId è null
			console.log("UserId non disponibile.");
		}
	}, [userId, dispatch]);

	useEffect(() => {
		// Controlla se l'array news è vuoto e se lo è, scarica le notizie
		if (!news.length) {
			dispatch(fetchCryptoNews());
		}
	}, [news]);

	return (
		<>
			<Row>
				<Col md={7}>
					<HomeCarousel />
				</Col>
				<Col md={5}>
					<WalletCard />
				</Col>
			</Row>
			<CryptoList />
		</>
	);
};

export default Home;
