import React from "react";
import { useSelector } from "react-redux";
import useHide from "../Tips/useHide";
import ModificaUtente from "../Admin/ModificaUtente";
import CoinLinkContent from "./CoinsLinkContent";
import { useToken } from "../../hooks/useToken";

const CoinsLink = () => {
	const selectedUserId = useSelector((state) => state.selectedUserId?.id);
	const token = useToken();
	const shouldHide = useHide(["/utentiList"]);
	// Rimuovere isSelected perché non influenzerà la logica di visualizzazione iniziale
	// const isSelected = !!selectedUserId;

	if (!token) {
		// Se non c'è un token, non mostrare nulla.
		return null;
	} else if (shouldHide) {
		// Mostra ModificaUtente con o senza userID. ModificaUtente gestirà lo scheletro
		return <ModificaUtente userId={selectedUserId} isSelected={!!selectedUserId} />;
	} else {
		// Altrimenti, mostra il contenuto principale di CoinLink.
		return <CoinLinkContent />;
	}
};

export default CoinsLink;
