import React, { useEffect, useRef } from "react";
import { createChart, CrosshairMode, PriceScaleMode } from "lightweight-charts";

const TradingViewChart = ({ data, onTimeRangeChange, selectedTimeRange, width, height }) => {
	const chartContainerRef = useRef();

	useEffect(() => {
		if (chartContainerRef.current && data.length > 0) {
			const chart = createChart(chartContainerRef.current, {
				width,
				height,
				layout: {
					backgroundColor: "#ffffff",
					textColor: "#333",
				},
				grid: {
					vertLines: {
						color: "#ebebeb",
					},
					horzLines: {
						color: "#ebebeb",
					},
				},
				priceScale: {
					scaleMargins: {
						top: 0.1,
						bottom: 0.1,
					},
					borderVisible: false,
					autoScale: true,
					mode: PriceScaleMode.Normal,
					entireTextOnly: true,
					priceFormat: {
						type: "custom",
						formatter: (price) => parseFloat(price).toFixed(8),
					},
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
				timeScale: {
					timeVisible: true,
					secondsVisible: false,
				},
			});

			const candleSeries = chart.addCandlestickSeries({
				upColor: "green",
				downColor: "red",
				wickUpColor: "green",
			});

			candleSeries.setData(data);

			chart.timeScale().fitContent();

			return () => chart.remove();
		}
	}, [data, width, height]);

	return (
		<>
			<TimeRangeSelector onChange={(e) => onTimeRangeChange(e.target.value)} selectedTimeRange={selectedTimeRange} />
			<div ref={chartContainerRef} style={{ width, height }} />
		</>
	);
};

const TimeRangeSelector = ({ onChange, selectedTimeRange }) => (
	<select onChange={onChange} value={selectedTimeRange}>
		<option value="1D">1D</option>
		<option value="1W">1W</option>
		<option value="1M">1M</option>
		<option value="3M">3M</option>
	</select>
);

export default TradingViewChart;
