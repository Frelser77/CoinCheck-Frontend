import React from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
// import { fetchCryptoNews } from "../../redux/reducer/CryptocCompareApi/fetchNews";
import { Link } from "react-router-dom";
// import styles from "./homeCarousel.module.css";
import styles from "./homeCarousel.module.css";
import { Card } from "react-bootstrap";
import Loader from "./Loader";
import { motion } from "framer-motion";

const HomeCarousel = ({ isSidebarOpen }) => {
	const news = useSelector((state) => state.news.news);
	const isLoading = useSelector((state) => state.news.loading);
	const errorr = useSelector((state) => state.news.error);
	// Opzioni per la configurazione di react-slick
	const settings = {
		dots: false,
		infinite: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 1920, // Da 1920px in poi
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1200, // Da 1200px a 1919px
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 992, // Da 992px a 1199px
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768, // Da 768px a 991px
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 481, // Da 481px a 767px
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 0, // Da 0px a 480px
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div className="mx-auto">
			<Loader isLoading={isLoading} />
			<motion.div className="d-flex align-items-center" transition={{ type: "spring", stiffness: 260, damping: 20 }}>
				<div className={`${styles.carouselWrapper}`}>
					<Slider {...settings}>
						{news.slice(0, 5).map((article, index) => (
							<Card key={index} className={`${styles.carouselContent} border-0 h-100`}>
								<div
									className={`${styles.cardBackground}`}
									style={{
										backgroundImage: `url(${article.imageurl})`,
									}}
								></div>
								<div className={styles.cardDetails}>
									<h3 className={styles.title}>{article.title}</h3>
									<p className={`${styles.articleContent} truncate-multiline`}>{article.body}</p>
									<Link to={`${article.guid}`} target="_blanck" className="ms-auto mt-5">
										Leggi di più
									</Link>
								</div>
							</Card>
						))}
					</Slider>
				</div>
			</motion.div>
		</div>
	);
};

export default HomeCarousel;
