
export async function getStocks() {
  return {

"Advanced Micro Devices, Inc.": "AMD",

"Alphabet Inc. Class A": "GOOGL",

"Alphabet Inc. Class C": "GOOG",

"Amazon.com, Inc.": "AMZN",

"Amgen Inc.": "AMGN",

"Apple Inc.": "AAPL",

"Berkshire Hathaway Inc.": "BRKB",

"Booking Holdings Inc.": "BKNG",

"Broadcom Inc.": "AVGO",

"CSX Corporation": "CSX",

"Eli Lilly and Company": "LLY",

"Marriott International, Inc.": "MAR",

"Marvell, Technology, Inc.": "MRVL",

"Meta Platforms, Inc.": "МЕТА",

"Microsoft Corporation": "MSFT",

"Nvidia Corporation": "NVDA",

"PayPal Holdings, Inc.": "PYPL",

"TSMC": "2330TW",

"Tesla, Inc.": "TSLA",

"Visa Inc.": "V"
  };
}


export async function getStockPrices(ticker, minutes) {
  const now = new Date();
  const prices = [];

  for (let i = minutes - 1; i >= 0; i--) {
    prices.push({
      price: Math.random() * 1000, 
      lastUpdatedAt: new Date(now.getTime() - i * 60000).toISOString(),
    });
  }

  return prices;
}
