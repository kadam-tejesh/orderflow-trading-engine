package com.orderflow.kafka_risk_service.event;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TradeEventProducer {

    private final KafkaTemplate<String, TradeExecutionEvent> kafkaTemplate;

    @Value("${orderflow.kafka.topic.trade-executions}")
    private String tradeExecutionsTopic;

    public void publish(TradeExecutionEvent event) {
        kafkaTemplate.send(tradeExecutionsTopic, event.getSymbol(), event);
    }
}
