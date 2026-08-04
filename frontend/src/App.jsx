import { useState, useEffect, useCallback } from 'react';
import { connectWebSocket, disconnectWebSocket } from './services/websocketService';
import TradeList from './components/TradeList';
import OrderEntryForm from './components/OrderEntryForm';
import OrderBook from './components/OrderBook';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  const handleTradeReceived = useCallback((trade) => {
    setTrades((prev) => [trade, ...prev].slice(0, 30));
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

  const handleSubmitOrder = (order) => {
    // Week 2 scope: log it. Wiring this to an actual "submit order" REST/WS
    // endpoint on the Matching Engine happens once that module exposes one.
    console.log('Order submitted:', order);
  };

  return (
    <div className="app">
      <header>
        <h1>OrderFlow Trading Terminal</h1>
        <span className={connected ? 'status connected' : 'status disconnected'}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </header>

      <main className="layout">
        <OrderEntryForm onSubmitOrder={handleSubmitOrder} />
        <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
        <TradeList trades={trades} />
      </main>
    </div>
  );
}

export default App;
