import React from "react";

const Dropdown = ({ onSelectCurrency }) => {
	const handleSelect = (e) => {
		onSelectCurrency(e.target.value);
	};

	return (
		<select onChange={handleSelect}>
			<option value="EUR">Euro</option>
			<option value="USD">Dollaro</option>
			<option value="GBP">Sterlina</option>
			<option value="JPY">Giapponese</option>
			<option value="AUD">Dollaro Australiano</option>
			<option value="CAD">Dollaro Canadiano</option>
			<option value="CHF">Franco Swiss</option>
			<option value="CLP">Peso Chileno</option>
			<option value="CNY">Yuan Chinese</option>
			<option value="COP">Peso Colombiano</option>
			<option value="CZK">Corona Ceca</option>
			<option value="DKK">Corona Danesa</option>
		</select>
	);
};

export default Dropdown;
