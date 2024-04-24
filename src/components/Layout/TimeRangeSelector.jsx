import React from "react";

const TimeRangeSelector = ({ onChange, selectedTimeRange, role }) => {
	const timeRanges = ["1D", "1W", "1M", "3M"];

	return (
		<div className="ms-auto mb-2">
			{timeRanges.map((range) =>
				(range === "3M" && (role === "Admin" || role === "Moderatore" || role === "UtentePro")) || range !== "3M" ? (
					<button
						key={range}
						onClick={() => onChange(range)}
						className={`btn btn-sm range button-range ${selectedTimeRange === range ? "selected" : ""}`}
					>
						{range}
					</button>
				) : null // Non mostrare l'opzione "3M" se il ruolo non è quello corretto
			)}
		</div>
	);
};

export default TimeRangeSelector;
