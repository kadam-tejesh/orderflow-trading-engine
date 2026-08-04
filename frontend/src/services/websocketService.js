import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectWebSocket(onTradeReceived, onConnected, onError) {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8084/ws', // Rajasri's Market Data Gateway port — confirm with her
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('Connected to Market Data Gateway');
      if (onConnected) onConnected();

      stompClient.subscribe('/topic/trades', (message) => {
        const trade = JSON.parse(message.body);
        onTradeReceived(trade);
      });
    },
    onStompError: (frame) => {
      console.error('WebSocket error:', frame);
      if (onError) onError(frame);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
  }
}