import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToken } from "../../hooks/useToken";

function useHide(targetPaths) {
	const location = useLocation();
	const token = useToken();
	const isPathMatched = targetPaths.some((path) => location.pathname.startsWith(path));
	const shouldHide = !token || isPathMatched;

	return shouldHide;
}

export default useHide;
