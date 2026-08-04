function OrderBook({ bids = [], asks = [] }) {
  return (
    <div className="order-book">
      <h2>Order Book</h2>
      <div className="order-book-columns">
        <div className="bids">
          <h3>Bids</h3>
          {bids.length === 0 && <p className="empty-state">No bids</p>}
          {bids.map((level, i) => (
            <div key={i} className="depth-row bid-row">
              <span>{level.price.toFixed(2)}</span>
              <span>{level.volume}</span>
            </div>
          ))}
        </div>
        <div className="asks">
          <h3>Asks</h3>
          {asks.length === 0 && <p className="empty-state">No asks</p>}
          {asks.map((level, i) => (
            <div key={i} className="depth-row ask-row">
              <span>{level.price.toFixed(2)}</span>
              <span>{level.volume}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderBook;