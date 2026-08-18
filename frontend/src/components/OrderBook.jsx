function OrderBook({ bids = [], asks = [] }) {
  return (
    <div className="order-book-columns">
      <div className="bids">
        <div className="side-label buy-label">Bids</div>
        {bids.length === 0 && <p className="empty-state">No bids</p>}
        {bids.map((level, i) => (
          <div key={i} className="depth-row bid-row">
            <span>{level.price.toFixed(2)}</span>
            <span>{level.volume}</span>
          </div>
        ))}
      </div>
      <div className="asks">
        <div className="side-label sell-label">Asks</div>
        {asks.length === 0 && <p className="empty-state">No asks</p>}
        {asks.map((level, i) => (
          <div key={i} className="depth-row ask-row">
            <span>{level.price.toFixed(2)}</span>
            <span>{level.volume}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderBook;