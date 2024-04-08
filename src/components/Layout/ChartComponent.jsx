import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, PriceScaleMode } from "lightweight-charts";

const TradingViewChart = ({ data, onTimeRangeChange, selectedTimeRange, height, isSidebarOpen }) => {
	const chartContainerRef = useRef();
	const chartRef = useRef(null); // Riferimento al grafico per accesso futuro
	const [chartWidth, setChartWidth] = useState(null);

	const updateChartWidth = () => {
		if (chartContainerRef.current) {
			setChartWidth(chartContainerRef.current.clientWidth);
		}
	};

	useEffect(() => {
		const chartContainer = chartContainerRef.current;
		let observer;

		if (chartContainer) {
			// Crea un ResizeObserver per ascoltare i cambiamenti di dimensione del contenitore
			observer = new ResizeObserver((entries) => {
				for (let entry of entries) {
					const { width } = entry.contentRect;
					setChartWidth(width);
				}
			});

			observer.observe(chartContainer);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, []); // Questo useEffect dipende solo dal montaggio e smontaggio del componente

	useEffect(() => {
		if (chartContainerRef.current && data.length > 0 && chartWidth) {
			// Se esiste già un grafico, rimuoverlo prima di crearne uno nuovo
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}

			const chart = createChart(chartContainerRef.current, {
				width: chartWidth,
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

			// Memorizza il riferimento al grafico creato
			chartRef.current = chart;
		}
	}, [data, chartWidth, height]);

	useEffect(() => {
		// Aggiorna la larghezza del grafico se già esistente
		if (chartRef.current) {
			const chart = chartRef.current;
			chart.applyOptions({ width: chartWidth });
			chart.timeScale().fitContent();
		}
	}, [chartWidth]);

	return (
		<>
			<TimeRangeSelector onChange={(e) => onTimeRangeChange(e.target.value)} selectedTimeRange={selectedTimeRange} />
			<div ref={chartContainerRef} style={{ width: "100%", height }} />
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
