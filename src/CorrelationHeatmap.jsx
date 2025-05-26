import React, { useEffect, useState } from "react";
import { getStocks, getStockPrices } from "./api";

function CorrelationHeatmap() {
  const [stocks, setStocks] = useState({});
  const [dataMatrix, setDataMatrix] = useState([]);
  const [minutes, setMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [hoverStats, setHoverStats] = useState(null);

  // Step 1: Fetch stocks
  useEffect(() => {
    getStocks().then(setStocks);
  }, []);

  // Step 2: Compute correlation matrix
  const handleGenerateHeatmap = async () => {
    setLoading(true);
    const tickers = Object.values(stocks);
    const allPrices = {};

    // Fetch prices for each stock
    for (let ticker of tickers) {
      const data = await getStockPrices(ticker, minutes);
      allPrices[ticker] = data.map((d) => d.price);
    }

    // Helper: compute correlation between 2 arrays
    const correlation = (arr1, arr2) => {
      const n = arr1.length;
      const avg1 = arr1.reduce((a, b) => a + b, 0) / n;
      const avg2 = arr2.reduce((a, b) => a + b, 0) / n;
      const cov = arr1.reduce((sum, x, i) => sum + (x - avg1) * (arr2[i] - avg2), 0) / n;
      const std1 = Math.sqrt(arr1.reduce((sum, x) => sum + (x - avg1) ** 2, 0) / n);
      const std2 = Math.sqrt(arr2.reduce((sum, y) => sum + (y - avg2) ** 2, 0) / n);
      return std1 && std2 ? cov / (std1 * std2) : 0;
    };

    // Generate correlation matrix
    const matrix = tickers.map((rowTicker) =>
      tickers.map((colTicker) => {
        const value = correlation(allPrices[rowTicker], allPrices[colTicker]);
        return { value, rowTicker, colTicker };
      })
    );

    setDataMatrix(matrix);
    setLoading(false);
  };

  // UI helpers
  const getColor = (val) => {
    const red = Math.round(255 * (1 - (val + 1) / 2));
    const green = Math.round(255 * ((val + 1) / 2));
    return `rgb(${red},${green},100)`;
  };

  const showStats = (ticker) => {
    const prices = dataMatrix.find((row) => row[0].rowTicker === ticker)?.map((d) => d.value) || [];
    const avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
    const std = (
      Math.sqrt(prices.reduce((sum, v) => sum + (v - avg) ** 2, 0) / prices.length) || 0
    ).toFixed(2);
    setHoverStats({ ticker, avg, std });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Correlation Heatmap</h2>

      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        min={1}
        max={120}
      />
      <span style={{ marginLeft: 8 }}>minutes</span>
      <button onClick={handleGenerateHeatmap} style={{ marginLeft: 10 }}>
        Generate Heatmap
      </button>

      {loading && <p>Loading data...</p>}

      {dataMatrix.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th></th>
                {Object.values(stocks).map((ticker) => (
                  <th key={ticker} onMouseEnter={() => showStats(ticker)}>
                    {ticker}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataMatrix.map((row, i) => (
                <tr key={i}>
                  <td onMouseEnter={() => showStats(row[0].rowTicker)}>
                    {row[0].rowTicker}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        backgroundColor: getColor(cell.value),
                        color: "#fff",
                      }}
                    >
                      {cell.value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hoverStats && (
        <div style={{ marginTop: 20 }}>
          <strong>{hoverStats.ticker}</strong> → Avg: {hoverStats.avg}, Std Dev: {hoverStats.std}
        </div>
      )}
    </div>
  );
}

export default CorrelationHeatmap;
