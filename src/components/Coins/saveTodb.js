import fetchWithAuth from "../../redux/reducer/back/interceptor";
import { Url } from "../../Config/config";
const saveToDatabase = async (criptovalutaDto) => {
	try {
		const response = await fetchWithAuth(`${Url}Criptovalute/addCoins`, {
			method: "POST",
			body: JSON.stringify(criptovalutaDto),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Errore nel salvataggio dei dati");
		}

		const responseData = await response.json();
		console.log("Dati salvati con successo:", responseData);
	} catch (error) {
		console.error("Errore nell'invio dei dati:", error);
	}
};

export default saveToDatabase;
