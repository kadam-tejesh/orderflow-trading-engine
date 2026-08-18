package com.orderflow.kafka_risk_service.event;



import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TradeEventConsumer {

    @KafkaListener(topics = "${orderflow.kafka.topic.trade-executions}", groupId = "risk-management-service")
    public void onTradeExecuted(TradeExecutionEvent event) {
        log.info("Received trade execution event: {}", event);
    }
}
