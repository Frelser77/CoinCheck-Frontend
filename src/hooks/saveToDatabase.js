// useSaveToDatabase.js
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import saveToDatabase from "../components/Coins/saveTodb";
import { calculatePriceChangePercentage } from "../components/Tips/utility"; // Assicurati di importare questa funzione
import useUserRole from "./useUserRole";

const useSaveToDatabase = () => {
	const { role, isLoading } = useUserRole();

	const handleSaveToDb = (coinDetails) => {
		const criptovalutaDto = {
			Nome: coinDetails.id,
			Simbolo: coinDetails.base_currency,
			PrezzoUsd: coinDetails.last ? parseFloat(coinDetails.last) : null,
			Variazione24h: coinDetails.open
				? calculatePriceChangePercentage(parseFloat(coinDetails.open), parseFloat(coinDetails.last))
				: null,
			Volume24h: coinDetails.volume ? parseFloat(coinDetails.volume) : null,
		};

		// console.log("dto", criptovalutaDto);

		saveToDatabase(criptovalutaDto)
			.then(() => {
				if (role === "Admin" || role === "Moderatore") {
					toast.success(`Dati della criptovaluta con id ${coinDetails.id} salvati con successo nel database.`);
				}
			})
			.catch((error) => {
				if (role === "Admin" || role === "Moderatore") {
					toast.error(`Errore nel salvataggio della criptovaluta con id ${coinDetails.id}: ${error}`);
				}
			});
	};

	return handleSaveToDb;
};

export default useSaveToDatabase;
