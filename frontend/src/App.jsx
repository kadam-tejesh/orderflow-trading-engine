import { useState, useEffect } from 'react';

function App() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fakeTrade = {
        tradeId: crypto.randomUUID(),
        symbol: 'AXLR',
        price: (100 + Math.random() * 5).toFixed(2),
        quantity: Math.floor(Math.random() * 20) + 1,
        executedAt: new Date().toISOString(),
      };
      setTrades((prev) => [fakeTrade, ...prev].slice(0, 20));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>OrderFlow Trading Terminal</h1>
      <ul>
        {trades.map((t) => (
          <li key={t.tradeId}>{t.symbol} — {t.quantity} @ ${t.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
