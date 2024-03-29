export const formatNumber = (number, minimumFractionDigits = 2, maximumFractionDigits = 6) => {
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(number);
};

export const calculatePriceChangePercentage = (open, last) => {
	const percentageChange = ((last - open) / open) * 100;
	return percentageChange.toFixed(2); // Limita a 2 decimali
};

export const formatVolume = (volume) => {
	if (!volume) return "0 $"; // Gestisci null, undefined, e 0

	const number = Number(volume); // Assicurati che sia un numero
	if (Number.isNaN(number)) return "N/A"; // Se non è un numero, ritorna "N/A"

	const billion = 1e9;
	const million = 1e6;

	if (number >= billion) {
		return (number / billion).toFixed(1) + " Bln $";
	} else if (number >= million) {
		return (number / million).toFixed(1) + " Mrd $";
	} else {
		return number.toFixed(1) + " $"; // Aggiungi questa linea per gestire numeri minori di un milione
	}
};
