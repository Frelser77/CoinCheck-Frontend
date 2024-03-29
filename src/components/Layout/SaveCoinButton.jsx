import saveToDatabase from "../Coins/saveTodb";

const SaveCoinButton = ({ coin, coinStats }) => {
	// Funzione per calcolare la variazione percentuale
	const calculateVariazione24h = (open, last) => {
		return open && last ? ((last - open) / open) * 100 : null;
	};

	const handleSave = () => {
		const stats = coinStats[coin.id] || {};
		// const ticker = tickers[coin.id] || {};

		const criptovalutaDto = {
			Nome: coin.id,
			Simbolo: coin.base_currency,
			PrezzoUsd: stats.last ? parseFloat(stats.last) : null,
			Variazione24h: calculateVariazione24h(parseFloat(stats.open), parseFloat(stats.last)),
			Volume24h: stats.volume ? parseFloat(stats.volume) : null,
		};

		saveToDatabase(criptovalutaDto)
			.then((response) => {
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

	return <button onClick={handleSave}>Salva nel DB</button>;
};

export default SaveCoinButton;
