import saveToDatabase from "../Coins/saveTodb";
import { toast } from "react-toastify";
const SaveCoinButton = ({ coin, coinStats }) => {
	// Funzione per calcolare la variazione percentuale
	const calculateVariazione24h = (open, last) => {
		return open && last ? ((last - open) / open) * 100 : null;
	};
	const handleSave = () => {
		const stats = coinStats[coin.id] ? coinStats[coin.id] : {};

		// console.log("coin", coin);
		// console.log("coinStats", coinStats);
		// console.log("coin.id", coin.id);
		// console.log("coinStats keys", Object.keys(coinStats));
		// console.log("Specific coin stats", stats);
		const criptovalutaDto = {
			Nome: coin.id,
			Simbolo: coin.base_currency,
			PrezzoUsd: stats.last ? parseFloat(stats.last) : null,
			Variazione24h: calculateVariazione24h(parseFloat(stats.open), parseFloat(stats.last)),
			Volume24h: stats.volume ? parseFloat(stats.volume) : null,
		};

		saveToDatabase(criptovalutaDto)
			.then((response) => {
				console.log("criptovalutaDto", criptovalutaDto);

				if (response.ok) {
					toast.success("Salvataggio effettuato con successo!");
				} else {
					// Puoi anche gestire diversamente i vari codici di errore qui
					toast.error("Errore durante il salvataggio!");
				}
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<div className="btn btn-success" onClick={handleSave}>
			Salva nel DB
		</div>
	);
};

export default SaveCoinButton;
