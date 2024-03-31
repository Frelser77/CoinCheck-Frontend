// CoinsLink.jsx
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

	if (!token) {
		// Se non c'è un token, non mostrare nulla.
		return null;
	} else if (shouldHide && selectedUserId) {
		// Se dovrebbe nascondere e c'è un userId selezionato, mostra ModificaUtente.
		return <ModificaUtente userId={selectedUserId} />;
	} else {
		// Altrimenti, mostra il contenuto principale di CoinLink.
		return <CoinLinkContent />;
	}
};

export default CoinsLink;
