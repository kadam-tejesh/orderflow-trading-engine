function TickerTape({ symbol = 'AXLR', lastPrice, trend = 'flat' }) {
  const displayPrice = lastPrice ? Number(lastPrice).toFixed(2) : '—.——';
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '·';

  const items = Array.from({ length: 8 }).map((_, i) => (
    <span className="ticker-item" key={i}>
      <span className="ticker-symbol">{symbol}</span>
      <span className={`ticker-price ticker-${trend}`}>{displayPrice}</span>
      <span className={`ticker-arrow ticker-${trend}`}>{arrow}</span>
    </span>
  ));

  return (
    <div className="ticker-tape" role="status" aria-label={`${symbol} last price ${displayPrice}`}>
      <div className="ticker-track">
        {items}
        {items}
      </div>
    </div>
  );
}

export default TickerTape;