import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

const GATEWAY_URL = 'http://localhost:8084/ws'; // confirm exact port/path with Rajasri

export function connectWebSocket({ onTradeReceived, onOrderBookUpdate, onConnected, onDisconnected, onError }) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(GATEWAY_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    onConnect: () => {
      console.log('[WebSocket] Connected to Market Data Gateway');
      if (onConnected) onConnected();

      stompClient.subscribe('/topic/trades', (message) => {
        const trade = JSON.parse(message.body);
        onTradeReceived(trade);
      });

      if (onOrderBookUpdate) {
        stompClient.subscribe('/topic/orderbook', (message) => {
          const depth = JSON.parse(message.body);
          onOrderBookUpdate(depth);
        });
      }
    },

    onDisconnect: () => {
      console.log('[WebSocket] Disconnected');
      if (onDisconnected) onDisconnected();
    },

    onStompError: (frame) => {
      console.error('[WebSocket] STOMP error:', frame.headers['message'], frame.body);
      if (onError) onError(frame);
    },

    onWebSocketError: (event) => {
      console.error('[WebSocket] Connection error:', event);
      if (onError) onError(event);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

export function isConnected() {
  return stompClient?.connected ?? false;
}