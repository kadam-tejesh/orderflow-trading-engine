function TradeList({ trades }) {
  if (trades.length === 0) {
    return <p className="empty-state">Waiting for trades…</p>;
  }

  return (
    <div className="trade-list">
      <h2>Recent Trades</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.tradeId}>
              <td>{t.symbol}</td>
              <td>${Number(t.price).toFixed(2)}</td>
              <td>{t.quantity}</td>
              <td>{new Date(t.executedAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradeList;