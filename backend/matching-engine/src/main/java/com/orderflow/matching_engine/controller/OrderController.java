package com.orderflow.matching_engine.controller;

import com.orderflow.matching_engine.disruptor.OrderPublisher;
import com.orderflow.matching_engine.order.Order;
import com.orderflow.matching_engine.risk.RiskCheckClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;
@CrossOrigin(origins = "http://localhost:5173")
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
            throw new IllegalStateException(
                    "Order rejected: insufficient funds for account " + order.getAccountId());
        }

        order.setOrderId(UUID.randomUUID().toString());
        order.setTimestamp(Instant.now());
        orderPublisher.publish(order);
        return order.getOrderId();
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleRiskRejection(IllegalStateException e) {
        return e.getMessage();
    }
}
