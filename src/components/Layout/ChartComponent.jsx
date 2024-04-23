import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, PriceScaleMode } from "lightweight-charts";
import TimeRangeSelector from "./TimeRangeSelector"; // Assicurati di importare il componente corretto

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
	}, []); // Dipendenza solo al montaggio e smontaggio

	useEffect(() => {
		if (chartContainerRef.current && data.length > 0 && chartWidth) {
			if (chartRef.current) {
				chartRef.current.remove(); // Rimuove il grafico esistente se viene ridimensionato o i dati cambiano
				chartRef.current = null;
			}

			// Crea il grafico con le opzioni per uno sfondo scuro
			const chart = createChart(chartContainerRef.current, {
				width: chartWidth,
				height,
				layout: {
					backgroundColor: "#FAEBD7",
					textColor: "#696969", // Testo chiaro per contrasto
				},
				grid: {
					vertLines: {
						color: "#696969", // Linee verticali più scure
					},
					horzLines: {
						color: "#696969", // Linee orizzontali più scure
					},
				},
				priceScale: {
					borderVisible: false,
					autoScale: true,
				},
				timeScale: {
					timeVisible: true,
					secondsVisible: false,
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
			});

			const candleSeries = chart.addCandlestickSeries({
				upColor: "green", // Colore per il prezzo in aumento
				downColor: "red", // Colore per il prezzo in diminuzione
				borderVisible: true,
			});

			candleSeries.setData(data);
			chart.timeScale().fitContent();
			chartRef.current = chart;
		}
	}, [data, chartWidth, height]);

	useEffect(() => {
		if (chartRef.current) {
			const chart = chartRef.current;
			chart.applyOptions({ width: chartWidth });
			chart.timeScale().fitContent();
		}
	}, [chartWidth]);

	// Gestore per il cambio di time range
	const handleTimeRangeChange = (newRange) => {
		onTimeRangeChange(newRange);
	};

	return (
		<div className="flex-center flex-column">
			<TimeRangeSelector onChange={handleTimeRangeChange} selectedTimeRange={selectedTimeRange} />
			<div ref={chartContainerRef} style={{ width: "100%", height }} />
		</div>
	);
};

export default TradingViewChart;
