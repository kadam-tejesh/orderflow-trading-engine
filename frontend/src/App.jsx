import { useState, useEffect, useCallback } from 'react';
import { connectWebSocket, disconnectWebSocket } from './services/websocketService';
import TradeList from './components/TradeList';
import OrderEntryForm from './components/OrderEntryForm';
import OrderBook from './components/OrderBook';
import CanvasOrderBook from './components/CanvasOrderBook';
import DepthVisualizer from './components/DepthVisualizer';
import TickerTape from './components/TickerTape';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [lastPrice, setLastPrice] = useState(null);
  const [trend, setTrend] = useState('flat');

  const handleTradeReceived = useCallback((trade) => {
    setTrades((prev) => [trade, ...prev].slice(0, 30));
    setLastPrice((prevPrice) => {
      if (prevPrice != null) {
        setTrend(trade.price > prevPrice ? 'up' : trade.price < prevPrice ? 'down' : 'flat');
      }
      return trade.price;
    });
  }, []);

  const handleOrderBookUpdate = useCallback((depth) => {
    setOrderBook(depth);
  }, []);

  useEffect(() => {
    connectWebSocket({
      onTradeReceived: handleTradeReceived,
      onOrderBookUpdate: handleOrderBookUpdate,
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onError: () => setConnected(false),
    });
    return () => disconnectWebSocket();
  }, [handleTradeReceived, handleOrderBookUpdate]);

  const handleSubmitOrder = async (order) => {
    try {
      const response = await fetch('http://localhost:8085/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: 'ACC001',
          symbol: 'AXLR',
          side: order.side,
          type: order.orderType,
          price: order.price,
          quantity: order.quantity,
        }),
      });
      if (!response.ok) {
        alert('Order rejected: ' + (await response.text()));
        return;
      }
      console.log('Order accepted:', await response.text());
    } catch (err) {
      console.error('Order submission failed:', err);
    }
  };

  return (
    <div className="app">
      <TickerTape symbol="AXLR" lastPrice={lastPrice} trend={trend} />

      <div className="header-bar">
        <div>
          <h1>ORDERFLOW</h1>
          <div className="subtitle">Real-time matching engine · Trading Terminal</div>
        </div>
        <span className={`status-pill ${connected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot" />
          {connected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      <main className="layout">
        <div className="panel">
          <h2>Place Order</h2>
          <OrderEntryForm onSubmitOrder={handleSubmitOrder} />
        </div>
        <div className="panel">
          <h2>Order Book</h2>
          <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
        </div>
        <div className="panel">
          <h2>Trade Tape</h2>
          <TradeList trades={trades} />
        </div>
      </main>

      <section className="layout-secondary">
        <div className="panel">
          <CanvasOrderBook bids={orderBook.bids} asks={orderBook.asks} />
        </div>
        <div className="panel">
          <DepthVisualizer bids={orderBook.bids} asks={orderBook.asks} />
        </div>
      </section>
    </div>
  );
}

export default App;
