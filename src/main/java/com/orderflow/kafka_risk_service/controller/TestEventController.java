package com.orderflow.kafka_risk_service.controller;

import com.orderflow.kafka_risk_service.event.TradeEventProducer;
import com.orderflow.kafka_risk_service.event.TradeExecutionEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestEventController {

    private final TradeEventProducer producer;

    @PostMapping("/publish-sample-trade")
    public String publishSample() {
        TradeExecutionEvent event = new TradeExecutionEvent(
                UUID.randomUUID().toString(),
                "AXLR",
                UUID.randomUUID().toString(),
                UUID.randomUUID().toString(),
                new BigDecimal("101.50"),
                new BigDecimal("10"),
                Instant.now()
        );
        producer.publish(event);
        return "Published sample trade event: " + event.getTradeId();
    }
}
