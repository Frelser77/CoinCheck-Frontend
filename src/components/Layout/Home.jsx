import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
// import CoinsFetcher from "./CoinList";
import CryptoList from "../Coins/CoinList";
import SideBarLeft from "./SideBarLeft";
import CoinsLink from "../Coins/CoinsLink";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import HomeCarousel from "./HomeCarousel";
import { loadUserPreferences } from "../../redux/reducer/CryptoDataBase/favoriteSlice";
import WalletCard from "./WalletCard";
import { toast } from "react-toastify";
// import CoinLink from "../Coins/CoinsLink";
const Home = ({ isSidebarOpen, showFavorites }) => {
	const news = useSelector((state) => state.news.news);
	const userId = useSelector((state) => state.login.user?.userId);
	const userPreferences = useSelector((state) => state.favorites?.userPreferences);
	const dispatch = useDispatch();

	useEffect(() => {
		if (userId) {
			dispatch(loadUserPreferences(userId));
		} else {
			// toast.error("UserId non disponibile.");
		}
	}, [userId, dispatch]);

	useEffect(() => {
		// Controlla se l'array news è vuoto e se lo è, scarica le notizie
		if (!news.length) {
			dispatch(fetchCryptoNews());
		}
	}, [news]);

	return (
		<Container>
			<Row>
				<Col xs={12} lg={7} className="order-md-1 order-lg-0">
					<HomeCarousel isSidebarOpen={isSidebarOpen} />
				</Col>
				<Col xs={12} lg={5} className="d-none d-md-block order-md-0 order-lg-1">
					<WalletCard />
				</Col>
			</Row>
			<CryptoList showFavorites={showFavorites} />
		</Container>
	);
};

export default Home;
