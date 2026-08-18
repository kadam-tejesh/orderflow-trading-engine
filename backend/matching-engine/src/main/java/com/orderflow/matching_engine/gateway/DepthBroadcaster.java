package com.orderflow.matching_engine.gateway;

import com.orderflow.matching_engine.order.OrderBook;
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

    @Scheduled(fixedRate = 100) // broadcasts every 100ms
    public void broadcastDepth() {
        var depth = Map.of(
                "bids", orderBook.bidDepth(10),
                "asks", orderBook.askDepth(10)
        );
        kafkaTemplate.send(orderBookTopic, depth);
    }
}
