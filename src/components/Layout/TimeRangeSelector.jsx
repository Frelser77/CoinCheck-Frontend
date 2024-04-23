import React from "react";

const TimeRangeSelector = ({ onChange, selectedTimeRange }) => {
	const timeRanges = ["1D", "1W", "1M", "3M"];

	return (
		<div className="ms-auto mb-2">
			{timeRanges.map((range) => (
				<button
					key={range}
					onClick={() => onChange(range)}
					className={`btn btn-sm range button-range ${selectedTimeRange === range ? "selected" : ""}`}
				>
					{range}
				</button>
			))}
		</div>
	);
};

export default TimeRangeSelector;
