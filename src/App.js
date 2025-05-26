import React from "react";
import StockPage from "./StockPage";
import CorrelationHeatmap from "./CorrelationHeatmap";

function App() {
  return (
    <div>
      <h1>📊 Stock Analytics</h1>
      <StockPage />
      <hr />
      <CorrelationHeatmap />
    </div>
  );
}

export default App;
