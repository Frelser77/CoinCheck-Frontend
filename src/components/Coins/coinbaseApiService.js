// import { fetchCoinStats, fetchCoinTicker } from "../../redux/reducer/CoinbaseApi/CoinbaseApi";
// import { fetchVolumeSummary } from "../../redux/reducer/CoinbaseApi/VolumeSummary";

// // Thunk action per il recupero dei dettagli delle monete
// export const fetchCoinsDetails = (coinIds) => async (dispatch) => {
// 	if (!Array.isArray(coinIds)) {
// 		throw new Error("coinIds deve essere un array di ID");
// 	}

// 	try {
// 		// Loop over each coinId and dispatch async thunks for each one.
// 		for (const coinId of coinIds) {
// 			await Promise.all([
// 				dispatch(fetchCoinTicker({ coinId })),
// 				dispatch(fetchCoinStats(coinId)),
// 				dispatch(fetchVolumeSummary({ coinId })),
// 				// Aggiungi altre dispatch qui se necessario
// 			]);
// 		}
// 	} catch (error) {
// 		// Qui gestisci eventuali errori
// 		console.error("Errore durante il fetch dei dettagli delle monete:", error);
// 		// Potresti voler dispatchare un'azione di errore qui
// 		// dispatch(fetchCoinsDetailsFailed(error));
// 	}
// };
