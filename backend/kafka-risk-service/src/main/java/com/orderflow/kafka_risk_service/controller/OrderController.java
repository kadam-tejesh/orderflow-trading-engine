package com.orderflow.kafka_risk_service.controller;


import com.orderflow.kafka_risk_service.disruptor.OrderPublisher;
import com.orderflow.kafka_risk_service.order.Order;
import com.orderflow.kafka_risk_service.risk.RiskCheckClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderPublisher orderPublisher;
    private final RiskCheckClient riskCheckClient;

    @PostMapping
    public String submitOrder(@RequestBody Order order) {
        var orderValue = order.getPrice().multiply(order.getQuantity());

        if (!riskCheckClient.hasSufficientFunds(order.getAccountId(), orderValue)) {
            throw new IllegalStateException("Order rejected: insufficient funds for account " + order.getAccountId());
        }

        order.setOrderId(UUID.randomUUID().toString());
        order.setTimestamp(Instant.now());
        orderPublisher.publish(order);
        return order.getOrderId();
    }
}
