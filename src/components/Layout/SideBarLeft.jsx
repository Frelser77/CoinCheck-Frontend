import React from "react";
import { FaBitcoin, FaEthereum, FaSpotify } from "react-icons/fa";
import { Link } from "react-router-dom";

const SideBarLeft = () => {
	return (
		<div className="side-bar-left p-3 position-fixed left-0">
			<h2>Menu</h2>
			<ul className="list-unstyled">
				{/* Aggiungi qui altri link per la tua watchlist o altre sezioni */}
				<li>
					<Link to="/watchlist">
						<FaBitcoin />
					</Link>
				</li>
				<li>
					<Link to="/altro">
						<FaEthereum />
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default SideBarLeft;
