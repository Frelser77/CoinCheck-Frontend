// import fetchWithAuth from "./interceptor";
// import { logout } from "./loginUser";
// import { persistor } from "../store/store";

// export const logoutUser = () => async (dispatch) => {
// 	try {
// 		const response = await fetchWithAuth("https://localhost:7180/api/Account/logout", {
// 			method: "POST",
// 		});

// 		if (response.ok) {
// 			dispatch(logout()); // Resetta lo stato di auth

// 			await persistor.purge();
// 		} else {
// 			throw new Error("Errore durante il logout");
// 		}
// 	} catch (error) {
// 		console.error("Errore nel logout:", error);
// 	}
// };
