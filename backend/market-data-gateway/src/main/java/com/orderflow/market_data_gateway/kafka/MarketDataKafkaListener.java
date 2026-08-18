package com.orderflow.market_data_gateway.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class MarketDataKafkaListener {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "trade.executions", groupId = "market-data-gateway")
    public void onTradeExecuted(Map<String, Object> trade) {
        messagingTemplate.convertAndSend("/topic/trades", (Object) trade);
    }

    @KafkaListener(topics = "order.book.updates", groupId = "market-data-gateway")
    public void onOrderBookUpdate(Map<String, Object> depth) {
        messagingTemplate.convertAndSend("/topic/orderbook", (Object) depth);
    }
}
