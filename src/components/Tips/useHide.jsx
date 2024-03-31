import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToken } from "../../hooks/useToken";

function useHide(targetPaths) {
	const location = useLocation();
	const token = useToken();
	const isPathMatched = targetPaths.some((path) => location.pathname.startsWith(path));
	const shouldHide = !token || isPathMatched; // Nascondi se non c'è token o se siamo sul percorso esatto

	return shouldHide;
}

export default useHide;
