import React from "react";
import { useSelector } from "react-redux";
import useHide from "../Tips/useHide";
import ModificaUtente from "../Admin/ModificaUtente";
import CoinLinkContent from "./CoinsLinkContent";
import { useToken } from "../../hooks/useToken";

const CoinsLink = () => {
	const selectedUserId = useSelector((state) => state.selectedUserId?.id);
	const token = useToken();
	const shouldHide = useHide(["/utentiList/", "/wallet"]);

	if (!token) {
		return null;
	} else if (shouldHide) {
		return <ModificaUtente userId={selectedUserId} />;
	} else {
		return <CoinLinkContent />;
	}
};

export default CoinsLink;
