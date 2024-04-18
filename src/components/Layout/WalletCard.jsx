// WalletBalanceCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faWallet } from "@fortawesome/free-solid-svg-icons";

const WalletCard = () => {
	return (
		<Card className="h-100">
			<Card.Body>
				<FontAwesomeIcon icon={faWallet} size="2x" className="text-primary mb-2" />
				<div className="d-flex align-items-center justify-content-between">
					<Card.Title>Saldo del Wallet</Card.Title>
					<Card.Text>€0,00 </Card.Text>
				</div>
				<div className="mt-3 bg-warning rounded rounded-pill px-3 py-2 flex-center gap-2">
					<FontAwesomeIcon icon={faTools} size="1x" className="text-secondary" />
					<span className="ms-2">Stiamo lavorando per aggiungere i wallet all'app.</span>
				</div>
			</Card.Body>
		</Card>
	);
};

export default WalletCard;
