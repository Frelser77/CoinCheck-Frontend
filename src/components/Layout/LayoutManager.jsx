import { useSelector } from "react-redux";
import ModificaUtente from "../Admin/ModificaUtente";
import useHide from "../Tips/useHide";

const LayoutManager = ({ children }) => {
	const selectedUserId = useSelector((state) => state.selectedUserId?.id);
	const shouldHide = useHide("/utenti");

	if (shouldHide && selectedUserId) {
		// Se devi nascondere il layout e hai un selectedUserId, mostra ModificaUtente
		return <ModificaUtente userId={selectedUserId} />;
	}

	// Altrimenti, mostra il layout originale
	return <>{children}</>;
};

export default LayoutManager;
