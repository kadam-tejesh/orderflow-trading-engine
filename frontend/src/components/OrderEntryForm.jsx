import { useState } from 'react';

function OrderEntryForm({ onSubmitOrder }) {
  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      side,
      orderType,
      price: orderType === 'MARKET' ? null : parseFloat(price),
      quantity: parseInt(quantity, 10),
    };
    if (onSubmitOrder) onSubmitOrder(order);

    // Reset form
    setPrice('');
    setQuantity('');
  };

  return (
    <form className="order-entry-form" onSubmit={handleSubmit}>
      <h2>Place Order</h2>

      <div className="field-group">
        <button
          type="button"
          className={side === 'BUY' ? 'active buy' : 'buy'}
          onClick={() => setSide('BUY')}
        >
          Buy
        </button>
        <button
          type="button"
          className={side === 'SELL' ? 'active sell' : 'sell'}
          onClick={() => setSide('SELL')}
        >
          Sell
        </button>
      </div>

      <label>
        Order Type
        <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
          <option value="LIMIT">Limit</option>
          <option value="MARKET">Market</option>
        </select>
      </label>

      {orderType === 'LIMIT' && (
        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
      )}

      <label>
        Quantity
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="submit-order">
        Submit {side} Order
      </button>
    </form>
  );
}

export default OrderEntryForm;