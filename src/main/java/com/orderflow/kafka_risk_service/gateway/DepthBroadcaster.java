package com.orderflow.kafka_risk_service.gateway;




import com.orderflow.kafka_risk_service.order.OrderBook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class DepthBroadcaster {

    private final OrderBook orderBook;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${orderflow.kafka.topic.order-book-updates}")
    private String orderBookTopic;

    @Scheduled(fixedRate = 100) // every 100ms, per the Week 3 spec
    public void broadcastDepth() {
        var depth = Map.of(
                "bids", orderBook.bidDepth(10),
                "asks", orderBook.askDepth(10)
        );
        kafkaTemplate.send(orderBookTopic, depth);
    }
}
