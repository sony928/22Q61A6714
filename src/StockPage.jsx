import React, { useEffect, useState } from "react";
import { getStocks, getStockPrices } from "./api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function StockPage() {
  const [stocks, setStocks] = useState({});
  const [selected, setSelected] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    getStocks()
      .then(setStocks)
      .catch(() => setError("Failed to fetch stock list"));
  }, []);


  const handleFetchPrices = async () => {
    if (!selected) return alert("Select a stock");

    setLoading(true);
    setError("");
    try {
      const data = await getStockPrices(selected, minutes);
      const priceData = Array.isArray(data) ? data : [data.stock];
      const formatted = priceData.map((p) => ({
        price: p.price,
        time: new Date(p.lastUpdatedAt).toLocaleTimeString(),
      }));
      setPrices(formatted);
    } catch (err) {
      setError("Failed to fetch prices. Please check token or connection.");
    } finally {
      setLoading(false);
    }
  };

  
  const avgPrice =
    prices.reduce((sum, p) => sum + p.price, 0) / (prices.length || 1);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📈 Stock Prices</h2>

      
      <select onChange={(e) => setSelected(e.target.value)} value={selected}>
        <option value="">Select stock</option>
        {Object.entries(stocks).map(([name, ticker]) => (
          <option key={ticker} value={ticker}>
            {name} ({ticker})
          </option>
        ))}
      </select>

    
      <input
        type="number"
        min="1"
        max="120"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <span style={{ marginLeft: 5 }}>minutes</span>

    
      <button
        onClick={handleFetchPrices}
        disabled={!selected || loading}
        style={{ marginLeft: 10 }}
      >
        {loading ? "Loading..." : "Show Prices"}
      </button>

    
      {error && <p style={{ color: "red" }}>{error}</p>}

      
      {prices.length > 0 && (
        <>
          <h3>📊 Average Price: {avgPrice.toFixed(2)}</h3>
          <LineChart
            width={600}
            height={300}
            data={prices}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#ff7300"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Price"
            />
            <Line
              type="monotone"
              dataKey={() => avgPrice}
              stroke="#387908"
              dot={false}
              strokeDasharray="5 5"
              name="Average"
            />
            <Legend />
          </LineChart>
        </>
      )}
    </div>
  );
}

export default StockPage;
