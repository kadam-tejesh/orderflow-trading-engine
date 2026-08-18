package com.orderflow.kafka_risk_service.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClearingConsumer {

    @KafkaListener(topics = "${orderflow.kafka.topic.trade-executions}", groupId = "clearing-service")
    public void onTradeExecuted(TradeExecutionEvent event) {
        var tradeValue = event.getPrice().multiply(event.getQuantity());
        log.info("Clearing trade {}: settling {} between buyer {} and seller {}",
                event.getTradeId(), tradeValue, event.getBuyOrderId(), event.getSellOrderId());
    }
}
